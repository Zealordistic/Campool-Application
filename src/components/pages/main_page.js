import React, { useState , useMemo} from 'react';
import './main_page.css';
import Nav  from '../common/navigation/nav';
import Filter  from '../dashboard/filter/filter';
import Dashboard  from '../dashboard/dashboard';
import ThemeContext, { ThemeProvider } from '../../context/ThemeContext';

const Main_page = () => {

  // use setTripData to modify tripdata 
  const [tripData, setTripData] = useState([]);
  // const tripData = [{"_id":"6609deb236bef3d3aab19d6c","creationTime":"2024-03-27T12:00:00Z","from":"CityA","to":"CityB","tripStart":"2024-04-05T08:00:00Z","tripEnd":"2024-04-05T12:00:00Z","firstName":"some","lastName":"user","rating":null},{"_id":"6609b33236bef3d3aab19d54","creationTime":"2024-03-26T12:10:00Z","from":"CityA","to":"CityB","tripStart":"2024-04-05T08:00:00Z","tripEnd":"2024-04-05T12:00:00Z","firstName":"Junyi","lastName":"Wu","rating":3.5},{"_id":"6609b33236bef3d3aab19d55","creationTime":"2024-02-20T10:00:00Z","from":"CityC","to":"CityD","tripStart":"2024-04-03T21:05:20.077Z","tripEnd":"2024-04-10T21:05:20.077Z","firstName":"Yan","lastName":"Liu","rating":4.5}];

  return (
    <ThemeProvider>
      <div >
        <Nav />
        <section className="page" >
          <Filter setTripData={setTripData}/>
          <Dashboard tripData={tripData} />
        </section>
      </div>
    </ThemeProvider>
    
  );
};

export default Main_page;
