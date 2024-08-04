import React, { useContext } from 'react';
import './nav.css';
import { Link } from 'react-router-dom';
import logo from '../../../image/logo.png';
import user from "../../../image/user.jpg";
import ThemeContext from '../../../context/ThemeContext';
import { getCookie } from 'react-use-cookie';

function Nav () {
  const { theme, colors } = useContext(ThemeContext);
  const primaryColor = colors[theme].primary;
  return (
    <div>
      <nav className="navbar" style={{ background: primaryColor }}>
        <div className="nav-left">
          <Link to="/main_page">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <Link to="/trips" className="nav-links">Trips</Link>
        </div>
        <div className="nav-right">
          <Link to="/profile" className="nav-user">
            <img src={user} alt="User Profile" className="user-profile" />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
