import React, { useState, useContext } from 'react';
import { ThemeProvider } from '../../../context/ThemeContext';
import Nav from '../../common/navigation/nav';
import './createReq.css';
import map1 from '../../../image/map_union.png'
import { useNavigate } from 'react-router-dom';
import { getCookie } from 'react-use-cookie';

function CreateReq() {

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/trip/request', {
      method: 'POST',
      body: JSON.stringify({
        from: from, to: to, date: date, startTime: startTime, type: "request",
        endTime: endTime, description: description, owner: getCookie("userId")
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          fetch(`http://localhost:5000/trip/${data.tripId}`, {
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
        <div className='createReq'>
          <div className='map-container'>
            <img src={map1} className='map-img' />
          </div>

          <div className='createReqContent'>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Date</label>
                <input type="text" placeholder="mm/dd/yyyy" value={date}
                  onChange={handleInputChange(setDate)} />
                <label></label>
              </div>
              <div className="input-group">
                <label>Start Time</label>
                <input type="text" placeholder="hour:minute" value={startTime}
                  onChange={handleInputChange(setStartTime)} />
                <label></label>
              </div>
              <div className="input-group">
                <label>End Time</label>
                <input type="text" placeholder="hour:minute" value={endTime}
                  onChange={handleInputChange(setEndTime)} />
                <label></label>
              </div>
              <div className="input-group">
                <label>From</label>
                <input type="text" placeholder="Pick up location" value={from}
                  onChange={handleInputChange(setFrom)} />
                <label></label>
              </div>
              <div className="input-group">
                <label>To</label>
                <input type="text" placeholder="Destination" value={to}
                  onChange={handleInputChange(setTo)} />
                <label></label>
              </div>
              <div className="input-group-description">
                <label>Description</label>
                <textarea placeholder="Description"
                  value={description} onChange={handleInputChange(setDescription)} />
              </div>
              <div className="buttons">
                <button type="submit">Create Request</button>
                <button type="button">Cancel</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </ThemeProvider>
  );
};

export default CreateReq;
