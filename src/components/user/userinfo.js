/**
 * This is the userinfo-component of Campool Project
 * where the user information display is handled
 * should be exported as <UserInfo />
 */

import React, { useState, useContext, useEffect } from 'react';
import './user.css';
import userIcon from "../../image/user.jpg";
import ThemeContext from '../../context/ThemeContext';
import { setCookie, getCookie } from 'react-use-cookie';
import { useNavigate } from 'react-router-dom';

function UserInfo() {
  const { theme, colors } = useContext(ThemeContext);
  const primaryColor = colors[theme].primary;
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/profile/${getCookie("userId")}`, {
      method: 'GET'
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          setUserData(data)
        })
      }
      else {
        response.json().then(data => {
          alert("Error: " + data.message);
        })
      }
    })
  }, []);


  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleLogout = () => {
    // Function to handle logout button click
    fetch(`http://localhost:5000/logout/${getCookie("username")}`,
      { method: 'PUT' }).then(response => {
        if (!response.ok) {
          throw new Error("Unable to fetch user information");
        }
        else {
          setCookie("username", "");
          setCookie("userId", "");
          navigate('/../login');
        }
      })
      .catch(error => {
        alert("Error fetching data: " + error.message);
      });
    console.log('Logout button clicked');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEditMode(false);
    fetch(`http://localhost:5000/profile/${getCookie("userId")}`, {
      method: 'PUT',
      body: JSON.stringify({ 'gender': userData.gender, 'phone': userData.phone, 'firstname': userData.firstname, 'lastname': userData.lastname, 'plate': userData.plate }),
      headers: {
        'Content-Type': 'application/json'
      }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const [showPopup, setShowPopup] = useState(false);
  const [plate, setPlate] = useState('');

  function handleAddVehicle() {
    setShowPopup(true);
  }

  function handleSubmitPlate() {
    // Implement to submit the license plate number
    // set isDriver to true
    // refeshpage
    fetch(`http://localhost:5000/profile/${getCookie("userId")}`, {
      method: 'PUT',
      body: JSON.stringify({ 'plate': plate }),
      headers: {
        'Content-Type': 'application/json'
      }
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

    setShowPopup(false);
  }

  const renderUserInfo = () => {
    if (editMode) {
      return (
        <form onSubmit={handleSave}>
          <p className='input-change'>
            <label >
              First Name:
              <input
                className='input-field'
                type="text"
                name="firstname"
                value={userData.firstname}
                onChange={handleInputChange}
              />
            </label>
          </p>
          <p className='input-change'>
            <label >
              Last Name:
              <input
                className='input-field'
                type="text"
                name="lastname"
                value={userData.lastname}
                onChange={handleInputChange}
              />
            </label>
          </p>
          <p className='input-change'>
            <label >
              Gender:
              <input
                className='input-field'
                type="text"
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
              />
            </label>
          </p>
          <p className='input-change'>
            <label >
              Phone Number:
              <input
                className='input-field'
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
              />
            </label>
          </p>
          <p className='input-change'>
          </p>
          <button className="save-button" style={{ background: primaryColor }} type="submit">Save</button>
        </form>
      );
    } else {
      return (
        <div className="user-info">
          <p className='displaytxt'>Name: {userData.firstname} {userData.lastname}</p>
          <p className='displaytxt'>Gender: {userData.gender} </p>
          <p className='displaytxt'>Phone Number: {userData.phone}</p>
          <p className='displaytxt'>Email: {userData.username}</p>
          {userData.isDriver && (<p className='displaytxt'>plate: {userData.plate}</p>)}
          {!userData.isDriver && (
            <p className='displaytxt'>
              Do you own a vehicle? Add it <a href="#" onClick={handleAddVehicle}>HERE</a>
            </p>
          )}

          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <h4>Enter License Plate Number: </h4>
                <input className='input-change' type="text" value={plate} onChange={(e) => setPlate(e.target.value)} />
                <button className="submit-button" style={{ background: primaryColor }} onClick={handleSubmitPlate}>Submit</button>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="user-info-container">
      <div className='user-info'>
        <div className="profile-picture-container">
          <img src={userIcon} alt="User" className="user-icon" />
        </div>
        <div className="rating-container">
          <span className="star-icon">★</span>
          <span className="rating"> {userData.rating} </span>
        </div>
        {renderUserInfo()}
        <div className='"buttons'>
          {!editMode && <button className="edit-button" style={{ background: primaryColor }} onClick={handleEdit}>Edit</button>}
          {!editMode && <button className="logout-button" style={{ background: primaryColor }} onClick={handleLogout}>Logout</button>}
        </div>
      </div>
    </div>
  )
}

export default UserInfo;