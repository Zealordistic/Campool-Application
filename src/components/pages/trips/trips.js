import React, { useState, useEffect } from 'react';
import Nav from '../../common/navigation/nav';
import TripCard2 from './tripcard2';
import './trips.css';
import { getCookie } from 'react-use-cookie';

const Trips = () => {
  const [currentTrips, setCurrentTrips] = useState([]);
  const [pendingTrips, setPendingTrips] = useState([]);
  const [historyTrips, setHistoryTrips] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/mytrips/${getCookie("userId")}`, {
      method: 'GET'
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          setCurrentTrips(data.data.current)
          setPendingTrips(data.data.pending)
          setHistoryTrips(data.data.history)

        })
      }
      else {
        response.json().then(data => {
          alert("Error: " + data.message);
        })
      }
    })
  }, []);
  return (
    <div>
      <Nav />
      <div className="trips-container">
        <h2>Current</h2>
        <div className="current-trips">
          {currentTrips.map(trip => (
            <div key={trip._id} className='trip-card'>
              <TripCard2 trip={trip} />
            </div>
          ))}
        </div>
        <h2>Pending</h2>
        <div className="pending-trips">
          {pendingTrips.map(trip => (
            <div key={trip._id} className='trip-card'>
              <TripCard2 trip={trip} />
            </div>
          ))}
        </div>
        <h2>History</h2>
        <div className="history-trips">
          {historyTrips.map(trip => (
            <div key={trip._id} className='trip-card'>
              <TripCard2 trip={trip} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trips;
