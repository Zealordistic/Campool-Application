import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from '../../../context/ThemeContext';
import Nav from '../../common/navigation/nav';
import map1 from '../../../image/map_union.png'
import { useNavigate } from 'react-router-dom';
import './tripInfo.css';
import userIcon from "../../../image/user.jpg";
import Typography from "@mui/material/Typography";
import { getCookie } from 'react-use-cookie';


function TripInfo() {

  const location = useLocation();
  const tripData = location.state.trip;
  console.log(tripData)
  const navigate = useNavigate();

  function joinTrip(tripId) {
    fetch('http://localhost:5000/trip/join', {
      method: 'PUT',
      body: JSON.stringify({ 'accepter': getCookie("userId"), 'tripId': tripId }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          navigate('/../../main_page');
        })
      }
      else {
        response.json().then(data => {
          alert("Error: " + data.message);
        })
      }
    })
  };


  return (
    <ThemeProvider>
      <div >
        <Nav />
        <div className='tripInfo'>
          <div className='map-container'>
            <img src={map1} className='map-img' />
          </div>

          <div className='tripInfo-Content'>
            <div className="info-group">
              <label>Start Time:</label>
              <span>{tripData.tripStart}</span>
            </div>
            <div className="info-group">
              <label>End Time:</label>
              <span>{tripData.tripEnd}</span>
            </div>
            <div className="info-group">
              <label>From:</label>
              <span>{tripData.from}</span>
            </div>
            <div className="info-group">
              <label>To:</label>
              <span>{tripData.to}</span>
            </div>

            <div className="card-user-info">
              <img src={userIcon} alt="User" className="user-icon" />
              <div className="user-details">
                <div className="user-name">
                  <Typography variant="h7" gutterBottom>
                    {`${tripData.firstName} ${tripData.lastName}`}
                  </Typography>
                </div>
                <div className="user-rating">
                  <Typography variant="body1" gutterBottom>
                    Rating: ⭐ {tripData.avgRating}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="input-group-description">
              <label>Description</label>
              <div className='description-text'>{tripData.description}</div>
            </div>
            <div className="buttons">
              {tripData.owner === getCookie("userId") ? (
                <button type="edit" onClick={() => console.log('Edit clicked')}>Edit</button>
              ) : (
                <button type="confirm" onClick={() => joinTrip(tripData._id)}>Confirm</button>
              )}
              <button type="withdraw" onClick={() => console.log('withdraw clicked')}>Withdraw</button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default TripInfo;