import React from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import './searchbar.css';

const SearchBar = ({ onChange, onSubmit }) => {
  return (
    <div className='search'>
      <TextField
        className='search-bar'
        label="Search"
        variant="outlined"
        onChange={onChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchBar;
