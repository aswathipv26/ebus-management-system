import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import Home from './pages/HomePage/Home';
import Navbar from './components/Navbar/Navbar';
import BusList from './pages/BusList/BusList';
import LocationTracker from './components/LocationTracker/LocationTracker';
import TrackBus from './pages/TrackBus/TrackBus';
import Admin from './pages/AdminDashboard/Admin';
import Driver from './pages/DriverDashboard/Driver';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ebus-management-system' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/buses' element={< BusList />} />
        <Route path='/location-track/:busId' element={< LocationTracker />} />
        <Route path='/track-bus' element={<TrackBus />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/driver' element={<Driver />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
