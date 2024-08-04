import React, { useState , useContext} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import Login from './components/pages/login/login';
import SignUp from './components/pages/signup/signup';
// import DashboardPage from './components/pages/DashboardPage';
import CreateOffer from './components/pages/offer/createOffer';
import CreateReq from './components/pages/request/createReq';
import TripInfo from './components/pages/trips/tripInfo';
import Main_page from './components/pages/main_page';
import Profile from './components/pages/userprofile/profile';
import Trips from './components/pages/trips/trips';
import ThemeContext from './context/ThemeContext';

import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/main_page" element={<Main_page />} />
          <Route path="/createReq" element={<CreateReq />} />
          <Route path="/createOffer" element={<CreateOffer />} />
          {/* <Route path="/:tripId" element={<TripInfo />} /> */}
          <Route path="/:tripInfo" element={<TripInfo />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
    
  );
}

export default App;
