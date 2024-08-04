import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'passenger',
  toggleTheme: () => {}, 
  colors: {
    passenger: {
      primary: '#faa000', // Passenger theme primary color
      secondary: '#fdf3d8' // Passenger theme secondary color
    },
    driver: {
      primary: '#7393b3', // Driver theme primary color
      secondary: '#c7d4e1' // Driver theme secondary color
    }
  }
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('passenger'); // 'driver' or 'passenger'
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'driver' ? 'passenger' : 'driver';
      localStorage.setItem('theme', newTheme); // Save the theme to local storage
      return newTheme;
    });
  };

  const colors = {
    passenger: {
      primary: '#faa000', // Passenger theme primary color
      secondary: '#fdf3d8' // Passenger theme secondary color
    },
    driver: {
      primary: '#7393b3', // Driver theme primary color
      secondary: '#c7d4e1' // Driver theme secondary color
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
