import React, { useState } from 'react';
import './profile.css';
import Nav  from '../../common/navigation/nav';
import UserInfo from '../../user/userinfo';
import { ThemeProvider } from '../../../context/ThemeContext';


const Profile = () => {
  return (
    <ThemeProvider>
      <div >
        <Nav />
        <UserInfo />
      </div>
    </ThemeProvider>
    
  );
};

export default Profile;
