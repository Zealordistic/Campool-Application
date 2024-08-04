/**
 * This is the signup-component of Campool Project
 * where the sign up portion is handled
 * should be exported as <SignUp />
 */

import React, { useState } from 'react'
import './signup.css'
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../image/logo.png';
//import  { Navigate, useNavigate} from 'react-router-dom'

const SignUp = () => {
  //let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstname, setFirst] = useState("");
  const [lastname, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirm] = useState("");

  const navigate = useNavigate();

  /**
    * Note: this function checks the validity of all input fields altogether
    * and returns a JSON object with result and message
    */
  function sanitycheck() {
    var phonenumber = phone.replace("-", "").replace(" ", "").trim(); // FIX: replace this with regex?
    if (phonenumber.length !== 10)
      return { 'result': false, 'reason': "Incorrect phone number format" };

    if (firstname.length <= 0)
      return { 'result': false, 'reason': "Invalid first name" };

    if (lastname.length <= 0)
      return { 'result': false, 'reason': "Invalid last name" };

    if (!email.endsWith("@rpi.edu"))
      return { 'result': false, 'reason': "Invalid RPI email" };

    if (password !== confirmpassword)
      return { 'result': false, 'reason': "Password mismatch" };

    if (password.length < 8)
      return { 'result': false, 'reason': "Password too short" };

    return { 'result': true, 'reason': "" };
  }

  function normalSignup(event) {
    event.preventDefault();
    var sanitycheckres = sanitycheck();
    /**
     * user put in information
     * do sanity check before sending register info to server
     * create JSON object base on user input
     * fetch(url,JSON) --> server --> {200, OK, Successful} --> take user to login page
     *                          +---> {40X, not OK, not successful} -->(not redirect user) and display the message
     */
    if (sanitycheckres.result === true) {
      var userinfo = {
        'operation': "Signup", 'username': email, 'password': password,
        'phone': phone, 'firstname': firstname, 'lastname': lastname
      };
      fetch("http://localhost:5000/signup", {
        method: 'POST',
        body: JSON.stringify(userinfo),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          navigate('/../login');
        }
        else {
          response.json().then(data => {
            alert("Error: " + data.message);
          })
        }
      })
    }
    else {
      alert("Error: " + sanitycheckres.reason);
    }

  }


  return (
    <div className='signup'>
      <section className="signupimg">
        <img src={logo} alt="Logo" style={{ width: '300px' }} />
      </section>

      <section className="inputs">
        <form onSubmit={normalSignup}>
          <input className='signupTxt' type="text" placeholder='Enter RPI Email' id="signup-email" onChange={(e) => setEmail(e.target.value)} required></input>

          <input className='signupTxt' type="text" placeholder='Enter First Name' id="signup-first" onChange={(e) => setFirst(e.target.value)} required></input>

          <input className='signupTxt' type="text" placeholder='Enter Last Name' id="signup-last" onChange={(e) => setLast(e.target.value)} required></input>

          <input className='signupTxt' type="text" placeholder='Enter Phone Number' id="signup-phone" onChange={(e) => setPhone(e.target.value)} required></input>

          <input className='signupTxt' type="password" placeholder='Enter password (>8 characters)' id="signup-pswd" onChange={(e) => setPassword(e.target.value)} required></input>

          <input className='signupTxt' type="password" placeholder='Confirm password' id="signup-cpswd" onChange={(e) => setConfirm(e.target.value)} required></input>
        </form>
      </section>

      <section className="features">
        <button className='signupBtn' onClick={normalSignup} id="continue">Sign Up</button>
        <div id="login">
          Already have an account?
          <a href="/login"> Log In</a>
        </div>
      </section>
    </div>
  )
}

export default SignUp;