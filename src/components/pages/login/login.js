
/**
 * This is the login-component of Campool Project
 * where the login portion is handled
 * should be exported as <Login />
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './login.css'
import logo from '../../../image/logo.png';
import { useCookie, setCookie } from 'react-use-cookie';

const Login = () => {
  //let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function normalLogin(event) {
    event.preventDefault();
    /**
     * user put in email and password
     * check if email is RPI email, if so continue
     * create JSON object => {email: <email>, password: <password>}
     * fetch(url,JSON) --> server --> {200, OK, Successful} --> take user to dashboard page
     *                          +---> {40X, not OK, not successful} -->(not redirect user) and display the message
     */
    if (email.endsWith("@rpi.edu")) {
      var userinfo = { 'operation': "Login", 'username': email, 'password': password };
      fetch("http://localhost:5000/login", {
        method: 'POST',
        body: JSON.stringify(userinfo),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          response.json().then(data => {
            setCookie("username", email.replace("@rpi.edu", ""));
            setCookie("userId", data.userId);
            navigate('/../../main_page');
          })
        }
        else {
          response.json().then(data => {
            alert("Error: " + data.message);
          })
        }
      })
    }
    else {
      alert("Error: this is not an RPI email.");
      window.location.reload();
    }

  }


  return (
    <div className='login'>
      <section className="loginimg">
        <img src={logo} alt="Logo" style={{ width: '300px', padding: '20px' }} />
      </section>

      <section className="inputs">
        <form onSubmit={normalLogin}>
          <input className='loginTxt' type="email" placeholder='Enter RPI Email' id="login-email" onChange={(e) => setEmail(e.target.value)} required></input>
          <input className='loginTxt' type="password" placeholder='Enter password' id="login-pswd" onChange={(e) => setPassword(e.target.value)} required></input>
        </form>
      </section>

      <section className="features">
        <a href='' id='forgot'>Forgot Password?</a>
        <br />
        <button className='loginBtn' onClick={normalLogin} id="loginbtn">Login</button>
        {/* <br />
        <button className='loginBtn' onClick={fakeLogin} id="loginwithRPI">Login with RPI credentials</button> */}

        <div id="signup">
          Don't have an account?
          <a href="/signup"> Sign up</a>
        </div>
      </section>
      <section className='fillblank'>

      </section>
    </div>
  );
};

export default Login;