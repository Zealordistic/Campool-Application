const { MongoClient } = require('mongodb');
const { boolean } = require('webidl-conversions');

const express = require('express');
const app = express();

// var bodyParser = require('body-parser');
const cors = require("cors");
const path = require("path");
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const port = 5000;

//connect to the database
const uri = '<PUT YOUR MONGODB CONNECTION STRING HERE>';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db;
client.connect()
    .then(() => {
        console.log("Successfully connected to MongoDB");
        db = client.db('<PUT YOUR MONGODB DATABASE COLLECTION NAME HERE>');
    })
    .catch(err => console.error("Failed to connect to MongoDB", err));

app.use(express.json());
app.use(cors());

app.post('/login', async function (req, res) {
    const { username, password } = req.body;
    console.log(username)
    try {
        // check username
        const user = await db.collection('users').findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // return userid if username and password match
        res.status(200).json({ message: "Login successful", userId: user._id.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { username, password, phone, firstname, lastname } = req.body;

        // prevent same user signup
        const user = await db.collection('users').findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Failed to create user' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user
        const { insertedId } = await db.collection("users").insertOne({
            username,
            password: hashedPassword,
            phone,
            firstname,
            lastname,
            isDriver: false,
            isLoggedIn: false,
            pendingTrips: [],
            historyTrips: []
        });

        if (!insertedId) {
            throw new Error('Failed to create user');
        }

        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// example link: http://localhost:5000/mainpage/offer/?&within=3&rating=4
app.get('/mainpage/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const filters = req.query;

        // type: offer or request
        // only return active trips to main page
        const pipeline = [
            {
                $match: {
                    type: type,
                    status: "active"
                }
            }
        ]

        // Within Filter: find tripstart within targetDate
        if (filters.within) {
            const targetDate = new Date(new Date().setHours(new Date().getHours() - 4));
            const days = parseInt(filters.within, 10);
            targetDate.setDate(targetDate.getDate() + days);
            console.log(targetDate);
            pipeline.push({
                $match: {
                    tripStart: { $lte: targetDate }
                }
            });
        }


        pipeline.push(
            // join users collection to get users' firstname and lastname
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            // join ratings to get rate of the owner
            {
                $lookup: {
                    from: "ratings",
                    localField: "owner",
                    foreignField: "userId",
                    as: "ratings"
                }
            },
            {
                $unwind: {
                    path: "$ratings",
                    preserveNullAndEmptyArrays: true
                }
            },
            // attributes in output
            {
                $group: {
                    _id: "$_id",
                    creationTime: { $first: "$creationTime" },
                    from: { $first: "$from" },
                    to: { $first: "$to" },
                    tripStart: { $first: "$tripStart" },
                    tripEnd: { $first: "$tripEnd" },
                    firstName: { $first: "$user.firstname" },
                    lastName: { $first: "$user.lastname" },
                    rating: { $avg: "$ratings.rate" }
                }
            },
            {
                $project: {
                    creationTime: 1,
                    from: 1,
                    to: 1,
                    tripStart: {
                        $dateToString: { format: "%m/%d/%Y %H:%M", date: { $toDate: "$tripStart" } }
                    },
                    tripEnd: {
                        $dateToString: { format: "%m/%d/%Y %H:%M", date: { $toDate: "$tripEnd" } }
                    },
                    firstName: 1,
                    lastName: 1,
                    rating: {
                        $cond: {
                            if: { $eq: ["$rating", null] },
                            then: "no rating",
                            else: "$rating"
                        }
                    }
                }
            },
            {
                $sort: { creationTime: -1 }
            }
        )

        // Rating Filter: find trips that post by user with average rating greater than targetRate.
        if (filters.rating) {
            const targetRate = parseFloat(filters.rating, 10);
            pipeline.push({
                $match: {
                    rating: { $gte: targetRate }
                }
            })

        }
        const trips = await db.collection('trips').aggregate(pipeline).toArray();
        res.status(200).json({ message: 'Success', data: trips });
    }
    catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ success: false, message: 'Error fetching trips' });
    }
});



app.get('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) },
            { projection: { username: 1, phone: 1, firstname: 1, lastname: 1, gender: 1, isDriver: 1 } });
        if (!user) {
            return res.status(400).json({ message: "Invalid user" });
        }

        const defaults = {
            gender: null,  // Ensuring gender is returned even if it's not in the database
            rating: null
        }

        // Calculate the average rating
        const ratings = await db.collection('ratings').aggregate([
            { $match: { userId: id } },
            { $group: { _id: null, avgRating: { $avg: '$rate' } } }
        ]).toArray();

        // Check if ratings exist and assign the average or default
        const avgRating = ratings.length ? ratings[0].avgRating : null;

        const userData = { ...defaults, ...user, rating: avgRating }

        res.status(200).json(userData);

    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });

    }
});


app.put('/profile/:id', async (req, res) => {
    try {
        const { visit, id } = req.params;
        const updates = req.body;

        // Validate if there is something to update
        if (Object.keys(updates).length === 0) {
            return res.status(200).json({ message: "No updates needed" });
        }

        // Create an update object that only includes fields to be updated
        const validFields = ['gender', 'phone', 'firstname', 'lastname', 'plate'];
        let updateData = {};
        for (let field of validFields) {
            if (updates.hasOwnProperty(field)) {
                updateData[field] = updates[field];
            }
        }
        if (updateData['plate']) {
            updateData['isDriver'] = true;
        }

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

app.post('/trip/:type', async (req, res) => {

    const { type } = req.params;
    const { from, to, date, startTime, endTime, description, owner } = req.body;
    console.log(req.body);
    // Basic input validation
    if (!from || !to || !date || !startTime || !endTime || !type || !owner || !description) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const { insertedId } = await db.collection("trips").insertOne({
            from,
            to,
            tripStart: new Date(new Date(`${req.body.date} ${startTime}`).setHours(new Date(`${date} ${startTime}`).getHours() - 4)),
            tripEnd: new Date(new Date(`${date} ${endTime}`).setHours(new Date(`${date} ${endTime}`).getHours() - 4)),
            description,
            creationTime: new Date(new Date().setHours(new Date().getHours() - 4)),
            type,
            status: "active", // Automatically set as active
            owner: new ObjectId(owner) // Ensure owner is stored as an ObjectId
        });

        if (!insertedId) {
            res.status(400).json({ message: "Trip creation failed" });
        }
        // Push the new trip ID into the user's pendingTrips list
        await db.collection('users').updateOne(
            { _id: new ObjectId(owner) },
            { $push: { pendingTrips: { tripId: insertedId, notify: false } } }
        );

        res.status(201).json({ message: "Trip created successfully", tripId: insertedId.toString() });

    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ message: 'Error creating trip' });
    }
});

app.get('/trip/:tripId', async (req, res) => {
    try {
        const { tripId } = req.params;

        const trip = await db.collection('trips').findOne({ _id: new ObjectId(tripId) });

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        const ownerInfo = await db.collection('users').findOne({ _id: trip.owner });
        const ratings = await db.collection('ratings').aggregate([
            { $match: { userId: trip.owner } },
            { $group: { _id: null, averageRating: { $avg: "$rate" } } }
        ]).toArray();

        const averageRating = ratings[0] ? ratings[0].averageRating : null;

        const formattedTripStart = moment(trip.tripStart).format('MM/DD/YYYY HH:mm');
        const formattedTripEnd = moment(trip.tripEnd).format('MM/DD/YYYY HH:mm');

        const response = {
            ...trip,
            tripStart: formattedTripStart,
            tripEnd: formattedTripEnd,
            firstName: ownerInfo.firstname,
            lastName: ownerInfo.lastname,
            avgRating: averageRating
        };

        res.status(200).json({ data: response });
    } catch (error) {
        console.error('Failed to fetch trip:', error);
        res.status(500).json({ message: 'ailed to fetch trip' });
    }
});


// user join a trip
app.put('/trip/join', async (req, res) => {
    try {
        // const { tripId } = req.params;
        const { accepter, tripId } = req.body;
        const userId = new ObjectId(accepter);
        // set the accepter field for trip 
        await db.collection('trips').updateOne(
            { _id: new ObjectId(tripId) },
            { $set: { accepter: new ObjectId(userId), status: "accepted" } }
        );

        //add trip to pending list for the accepter
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $push: { pendingTrips: { tripId: new ObjectId(tripId), notify: true } } }
        );

        //set notification for owner to true
        const trip = await db.collection('trips').findOne({ _id: new ObjectId(tripId) });
        if (trip) {
            await db.collection('users').updateOne({
                _id: trip.owner,
                "pendingTrips.tripId": trip._id
            },
                {
                    $set: { "pendingTrips.$.notify": true }
                }
            );
        } else {
            return res.status(400).json({ message: 'cannot find trip' });
        }

        res.status(200).json({ message: "trip updated successfully" });

    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ success: false, message: 'Error updating trip' });
    }
});


// owner modify a trip
app.put('/trip/:tripId', async (req, res) => {
    try {
        const { tripId } = req.params;
        const updates = req.body;

        // Validate if there is something to update
        if (Object.keys(updates).length === 0) {
            return res.status(200).json({ message: "No updates needed" });
        }

        // Create an update object that only includes fields to be updated
        const validFields = ['from', 'to', 'tripStart', 'tripEnd', 'description', 'status'];

        // if trip changes by the owner and it has an accepter, set notification to true for accepter
        const trip = await db.collection('trips').findOne({ _id: new ObjectId(tripId), accepter: { $exists: true, $ne: null } });
        if (trip) {
            console.log("found")
            await db.collection('users').updateOne({
                _id: trip.accepter,
                "pendingTrips.tripId": trip._id
            },
                {
                    $set: { "pendingTrips.$.notify": true }
                }
            );
        }
        // update the provided fields
        let updateData = {};
        for (let field of validFields) {
            if (updates.hasOwnProperty(field)) {
                updateData[field] = updates[field];
            }
        }
        const response = await db.collection('trips').updateOne(
            { _id: new ObjectId(tripId) },
            { $set: updateData }
        );

        res.status(200).json({ message: "trip updated successfully" });

    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ success: false, message: 'Error updating trip' });
    }
});

app.delete('/trip/:tripId/', async (req, res) => {
    try {
        const { tripId } = req.params;

        const trip = await db.collection('trips').findOne({ _id: new ObjectId(tripId) });

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (trip.accepter) {
            return res.status(400).json({ message: "Trip cannot be deleted as it has an accepter." });
        }

        await db.collection('trips').deleteOne({ _id: new ObjectId(tripId) });

        // Remove the tripId from the owner's pendingTrips array
        await db.collection('users').updateOne(
            { _id: trip.owner },
            { $pull: { pendingTrips: { tripId: new ObjectId(tripId) } } }
        );

        res.status(200).json({ message: 'trip deleted successfully' });

    } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).json({ message: 'Error deleting trip' });
    }
});

app.post('/rating', async (req, res) => {
    try {
        const { userId, rate, description } = req.body;

        const { insertedId } = await db.collection("ratings").insertOne({
            userId: new ObjectId(userId),
            rate,
            description
        });

        if (!insertedId) {
            throw new Error('Failed to create user');
        }

        res.status(200).json({ message: 'rate successfully' });
    } catch (error) {
        console.error('rate error:', error);
        res.status(500).json({ message: 'Error rating user' });
    }
});

app.get('/myTrips/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const myId = new ObjectId(userId);
        const user = await db.collection('users').findOne({ _id: myId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const today = new Date(new Date().setHours(new Date().getHours() - 4));
        console.log(today);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);


        const pendingTripsIds = user.pendingTrips.map(pt => pt.tripId);
        const historyTripsIds = [];
        // const historyTripsIds = user.historyTrips.map(ht => ht.tripId);

        let notification = {};
        for (let t of user.pendingTrips) {
            notification[t.tripId] = t.notify;
        }

        for (let t of historyTripsIds) {
            notification[t.tripId] = t.notify;
        }

        const trips = await db.collection('trips').aggregate([
            {
                $match: {
                    _id: { $in: [...pendingTripsIds, ...historyTripsIds] },
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'ownerInfo'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'accepter',
                    foreignField: '_id',
                    as: 'accepterInfo'
                }
            },
            {
                $addFields: {
                    userInfo: {
                        $cond: {
                            if: { $eq: ["$owner", myId] },
                            then: "$accepterInfo",
                            else: "$ownerInfo"
                        }
                    }
                }
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true  // Keep trips even if userInfo is null
                }
            },
            {
                $lookup: {
                    from: 'ratings',
                    localField: "userInfo._id",
                    foreignField: 'userId',
                    as: 'ratings'
                }
            },
            {
                $unwind: {
                    path: "$ratings",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$_id",
                    creationTime: { $first: "$creationTime" },
                    from: { $first: "$from" },
                    to: { $first: "$to" },
                    tripStart: { $first: "$tripStart" },
                    tripEnd: { $first: "$tripEnd" },
                    type: { $first: "$type" },
                    firstName: { $first: "$userInfo.firstname" },
                    lastName: { $first: "$userInfo.lastname" },
                    rating: { $avg: "$ratings.rate" }
                }
            },
            {
                $addFields: {
                    isCurrent: {
                        $and: [
                            { $gte: ["$tripStart", today] },
                            { $lt: ["$tripStart", tomorrow] },
                            { $in: ["$_id", pendingTripsIds] }
                        ]
                    },
                    isPending: {
                        $and: [
                            { $gte: ["$tripStart", tomorrow] },
                            { $in: ["$_id", pendingTripsIds] }
                        ]
                    },
                    isHistory: { $or: [{ $in: ["$_id", historyTripsIds] }, { $lt: ["$tripStart", today] }] }
                }
            },
            {
                $sort: { tripStart: 1 }
            }
        ]).toArray();

        const current = trips.filter(t => t.isCurrent).map(trip => formatTrip(trip, notification));
        const pending = trips.filter(t => t.isPending).map(trip => formatTrip(trip, notification));
        const history = trips.filter(t => t.isHistory).map(trip => formatTrip(trip, notification));
        res.status(200).json({ data: { current, pending, history } });
        // res.status(200).json(trips);


    } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).json({ message: 'Error finding my trips' });
    }
});

function formatTrip(trip, notification) {
    return {
        _id: trip._id,
        from: trip.from,
        to: trip.to,
        tripStart: moment(trip.tripStart).format('MM/DD/YYYY HH:mm'),
        tripEnd: moment(trip.tripEnd).format('MM/DD/YYYY HH:mm'),
        type: trip.type,
        notifi: notification[trip._id.toString()],
        firstName: trip.firstName,
        lastName: trip.lastName,
        rating: trip.rating,
    };
}

app.get('/isDriver/:username/', async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ username: req.params.username + "@rpi.edu" }, { _id: 0, isDriver: 1 });
        if (!user)
            res.status(404).json({ message: "The specified user does not exist" });
        else
            res.status(200).json({ isDriver: user.isDriver })
    }
    catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ message: 'Error fetching user information' });
    }
});

app.put('/logOut/:username/', async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ username: req.params.username + "@rpi.edu" });
        if (!user)
            res.status(404).json({ message: "The specified user does not exist" });
        else {
            await db.collection('users').updateOne({ username: req.params.username + "@rpi.edu" }, { $set: { isLoggedin: false } });
            res.status(200).json({ message: "Log out successful" });
        }
    }
    catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Error logging out user' });
    }
});



app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});



// fetch("http://localhost:5000/mainpage", { method: 'GET' }).then(response => {
//     if (response.ok) {
//         response.json().then(data => {

//         })
//     }
//     else {
//         response.json().then(data => {
//             alert("Error: " + data.message);
//         })
//     }
// }) 