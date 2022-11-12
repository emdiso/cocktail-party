import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LSPopUp from './LSPopUp';
import Login from './Login';

const Navbar = () => {
  
  return (
    <div id="Navbar" className='Navbar'>
      <Link to='/'>
        <button color='secondary'> Home </button>
      </Link>
      <Link to='/random'>
        <button color='secondary'> Random </button>
      </Link>
      <button color='secondary'> Generate Menu </button>
    </div>
  )
};

export default Navbar;