import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {};
    // }
    render() {
        return (
            <div id="Navbar" className='Navbar'>
              <Link to='/'>
                <button color='secondary'> Home </button>
              </Link>
              <button color='secondary'> Random </button>
              <button color='secondary'> Generate </button>
              <button color='secondary'> Random </button>
              <Link to='login'>
                <button color='secondary'> Log In </button>
              </Link>
              <Link to='signup'>
                <button color='secondary'> Sign Up </button>
              </Link>
            </div>
        )
    };
}

export default Navbar;