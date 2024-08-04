import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import userIcon from "../../../image/user.jpg";
import DeleteIcon from '@mui/icons-material/Delete';
import './tripcard2.css';
import { useNavigate } from 'react-router-dom';

export default function TripCard2({ trip }) {
  console.log(trip)
  const tripId = trip._id;
  const firstName = trip.firstName;
  const lastName = trip.lastName;
  const rating = trip.rating;
  const tripStart = trip.tripStart;
  const tripEnd = trip.tripEnd;
  const type = trip.type;
  const from = trip.from;
  const to = trip.to;
  const notifi = trip.notifi;
  const navigate = useNavigate();

  function viewTrip(tripId) {
    fetch(`http://localhost:5000/trip/${tripId}`, {
      method: 'GET'
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          navigate('/../../tripInfo', { state: { trip: data.data } });
        })
      }
      else {
        response.json().then(data => {
          alert("Error: " + data.message);
        })
      }
    })
  };

  function handleDelete(tripId) {
    fetch(`http://localhost:5000/trip/${tripId}`, {
      method: 'DELETE'
    }).then(response => {
      if (response.ok) {
        window.location.reload();
      }
      else {
        response.json().then(data => {
          alert("Error: " + data.message);
        })

      }
    })
  };

  return (
    <div>
      <Card>
        <CardContent>
          {/* {trip ? ( */}
          <>
            <div className="card-top">
              <div className="card-user-info">
                <img src={userIcon} alt="User" className="user-icon" />
                <div className="user-details">
                  <div className="user-name">
                    <Typography variant="h7" gutterBottom>
                      {`${firstName} ${lastName}`}
                    </Typography>
                  </div>
                  <div className="user-rating">
                    <Typography variant="body1" gutterBottom>
                      Rating: ⭐ {rating}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="card-type">
                {type}
              </div>

            </div>

            <div className="divider"></div>

            <div className="trip-info">
              <div>
                <div className="time">
                  <Typography variant="body1"> Time: </Typography>
                </div>
                <div className="location">
                  <Typography variant="body1"> From: </Typography>
                </div>
                <div className="location">
                  <Typography variant="body1"> To: </Typography>
                </div>
              </div>
              <div className="trip-info-right">
                <div className="time">
                  <Typography variant="body1"> {tripStart} ~ {tripEnd} </Typography>
                </div>
                <div className="location">
                  <Typography variant="body1"> {from} </Typography>
                </div>
                <div className="location">
                  <Typography variant="body1"> {to} </Typography>
                </div>
              </div>

            </div>
          </>
          {/* ) : (
            <Typography>Loading Trip ...</Typography>
          )} */}

        </CardContent>
        <CardActions>
          <div className="card-bottom" >
            <div style={{ position: 'relative', display: 'inline-block' }}> {/* Container to control the relative positioning */}
              <Button onClick={() => viewTrip(tripId)} border='3px' size="small">View Trip</Button>
              {notifi && <span className="notification-dot"></span>}
            </div>
            <div className="trash">
              <DeleteIcon style={{ width: '10%', cursor: 'pointer' }} onClick={() => handleDelete(tripId)} />
            </div>
          </div>
        </CardActions>
      </Card>
    </div>
  );
}

// <CardActions>
//   <div className="card-bottom">
//     <Button border='3px' size="small" onClick={() => viewTrip(tripId)} >View Trip</Button>
//     {notifi && <span className="notification-dot"></span>}
//   </div>
//   <DeleteIcon className="trash" style={{ width: '10%', cursor: 'pointer' }} onClick={() => handleDelete(tripId)} />
// </CardActions>

//     <CardActions>
// <div className="card-bottom">
//   <div style={{ position: 'relative', display: 'inline-block' }}> {/* Container to control the relative positioning */}
//     <Button border='3px' size="small">View Trip</Button>
//     {notifi && <span className="notification-dot"></span>}
//   </div>
//   <div className="trash">
//     <DeleteIcon style={{ width: '10%', cursor: 'pointer' }} onClick={() => handleDelete} />
//   </div>
// </div>
// </CardActions>

