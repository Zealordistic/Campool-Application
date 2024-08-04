import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';
import TripCard from './tripcard';
import SearchBar from '../common/searchbar';
import ThemeContext from '../../context/ThemeContext';

function Dashboard({ tripData }) {
  const { theme, colors } = useContext(ThemeContext);
  const darkColor = colors[theme].primary;
  const lightColor = colors[theme].secondary;

  const dashboardStyle = {
    backgroundColor: lightColor,
  }

  const buttonStyle = {
    backgroundColor: darkColor,
    border: darkColor,
  }

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Here you can add the logic to handle the search query, such as sending it to an API or performing a local search
    console.log('Search submitted:', searchQuery);
  };

  return (
    <div className="dashboard" style={dashboardStyle}>
      <SearchBar onChange={handleSearchChange} onSubmit={handleSearchSubmit} />
      <div className="search-results">
        <div className="card-container">
          {tripData.map((trip, index) => (
            <div key={index} className="card">
              <TripCard
                trip={trip}
              />
            </div>
          ))}
        </div>
      </div>

      {theme === 'passenger' ? (
        <Link to="/createReq">
          <button className="create-button" style={buttonStyle} >+</button>
        </Link>
      ) : (
        <Link to="/createOffer">
          <button className="create-button" style={buttonStyle} >+</button>
        </Link>
      )}

    </div>


  );
};

export default Dashboard;
