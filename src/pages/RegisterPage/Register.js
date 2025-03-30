import React, {useState} from 'react';
import { registerUser } from '../../authForm/auth';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
            e.preventDefault();
            try {
                await registerUser(email, password);
                alert("Registration successful!");
                navigate('/login');
    
            } catch (err) {
              setError(err.message)
            }
        };
  return (
    <div className='register-container'>
      <h2>Register</h2>
        {error && <p className='error'>{error}</p>}
        <form onSubmit={handleRegister}>
            <input type='name' placeholder='First Name' value={firstname} onChange={(e) => setFirstName(e.target.value)}/> 
            <input type='name' placeholder='Last Name' value={lastname} onChange={(e) => setLastName(e.target.value)}/> 
            <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type='submit'>Register</button>
        </form>
    </div>
  );
};

export default Register;
