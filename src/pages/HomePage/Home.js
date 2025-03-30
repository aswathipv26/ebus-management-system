import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className='home-container'>
        <h1>Welcome to Ebus Management System</h1>
        <p>Track buses and plan your journey with ease</p>

        <div className='home-buttons'>
            <Link to='/login'>
            <button>Login</button>
            </Link>
            <Link to='/register'>
            <button>Register</button>
            </Link>
        </div>
      
    </div>
  )
}

export default Home
