import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  
  return (
    <div id="Navbar" className='Navbar'>
      <Link to='/'>
        <button color='secondary'> Home </button>
      </Link>
      <Link to='/random'>
        <button color='secondary'> Random </button>
      </Link>
      <Link to='generate'>
        <button color='secondary'> Generate Menu </button>
      </Link>
    </div>
  )
};

export default Navbar;