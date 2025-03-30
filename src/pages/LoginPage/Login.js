import React, { useState } from 'react';
import { loginUser } from '../../authForm/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser(email, password);
            alert("Login successful!");
            navigate('/buses');
            

        } catch (err) {
            setError(err.message);
        }
    };
    
      return (
    <div className='login-container'>
        <h2>Login</h2>
        {error && <p className='error'>{error}</p>}
        <form onSubmit={handleLogin}>
            <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type='submit'>Login</button>
        </form>

    </div>
  )
}

export default Login;