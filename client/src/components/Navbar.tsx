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
      <button color='secondary'> Generate </button>
      <button color='secondary'> Random </button>
      <button color='secondary' onClick={LSPopUp}> Log In </button>
    </div>
  )
};

export default Navbar;