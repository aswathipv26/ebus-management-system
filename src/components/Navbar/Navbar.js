import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className='navbar'>
        <div className='home-link'>
            <Link to='/'>Ebus Management</Link>
        </div>
        <ul className='nav-links'>
            <Link to='/'>Home</Link>
            <Link to='/buses'>Buses</Link>
            <Link to='/location-track/:busId'>Location Tracker</Link>
            <Link to='/track-bus'>Bus Track</Link>
        </ul>
    </nav>
  );
};

export default Navbar;
