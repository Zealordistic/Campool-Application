import React, { useState, useContext, useEffect } from 'react';
import './filter.css';
import ThemeContext from '../../../context/ThemeContext';
import { getCookie } from 'react-use-cookie';

function Filter({ setTripData }) {

  const { theme, colors, toggleTheme } = useContext(ThemeContext);

  const handleSwitchChange = () => {
    // TO-DO: fix slider moving even if not supposed to
    fetch("http://localhost:5000/isDriver/" + getCookie("username"))
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unable to fetch user information");
        }
      })
      .then(data => {
        if (data.isDriver) toggleTheme();
      })
      .catch(error => {
        alert("Error fetching data: " + error.message);
      });
  };

  const primaryColor = colors[theme].primary;

  const [dateFilter, setDateFilter] = useState(null);
  const [rateFilter, setRateFilter] = useState(null);


  const constructUrl = () => {
    let url = theme === 'passenger' ? "http://localhost:5000/mainpage/offer/?" : "http://localhost:5000/mainpage/request/?";
    if (dateFilter) {
      url += `within=${dateFilter}&`;
    }
    if (rateFilter) {
      url += `rating=${rateFilter}&`;
    }

    if (url.endsWith('&')) {
      url = url.slice(0, -1);
    }
    return url;
  };

  useEffect(() => {
    fetch(constructUrl())
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then(data => {
        setTripData(data.data);
      })
      .catch(error => {
        alert("Error fetching data: " + error.message);
      });
  }, [dateFilter, rateFilter, theme]);

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleRateFilterChange = (event) => {
    setRateFilter(event.target.value);
  };

  const clearFilters = () => {
    setDateFilter(null);
    setRateFilter(null);
  };

  return (
    <div className="slide-filter">
      <div className="switch-driver">
        <h3>{theme === 'driver' ? 'Switch to Passenger' : 'Switch to Driver'}</h3>
        <label className="switch">
          <input type="checkbox" onChange={handleSwitchChange} />
          <span className="slider round" style={{ background: primaryColor }}></span>
        </label>
      </div>


      <div className="filters">
        <h3>Filter</h3>
        <div className="filter-group">
          <h5>Date</h5>
          <label><input type="radio" name="date" value="1" checked={dateFilter === "1"} onChange={handleDateFilterChange} /> Today</label><br />
          <label><input type="radio" name="date" value="3" checked={dateFilter === "3"} onChange={handleDateFilterChange} /> &lt; 3 Days</label><br />
          <label><input type="radio" name="date" value="7" checked={dateFilter === "7"} onChange={handleDateFilterChange} /> &lt; 1 Week</label><br />
          <label><input type="radio" name="date" value="30" checked={dateFilter === "30"} onChange={handleDateFilterChange} /> &lt; 1 Month</label><br />
        </div>
        <div className="filter-group">
          <h5>Rate</h5>
          <label><input type="radio" name="rate" value="4" checked={rateFilter === "4"} onChange={handleRateFilterChange} /> &gt; 4.0</label><br />
          <label><input type="radio" name="rate" value="3" checked={rateFilter === "3"} onChange={handleRateFilterChange} /> &gt; 3.0</label><br />
        </div>
        <button className="clear-filter" style={{ background: primaryColor, border: primaryColor }} onClick={clearFilters}>Clear Filters</button>
      </div>
    </div>
  );
};

export default Filter;