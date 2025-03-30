import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db} from '../../firebase/firebaseConfig';
import { collection, addDoc, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import './Admin.css';

const Admin = () => {
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [newBus, setNewBus] = useState({busNumber: "", route: "", driverId: ""});
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if(user) {
              console.log("Authenticated user:", auth.currentUser);

              try {
                const userDocRef = doc(db, 'users', auth.currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const role = userDoc.data().role;
                    console.log("User Role from Firestore:", role);
                    setUserRole(role);
                } else {
                    console.log("No user document found from UID:", auth.currentUser.uid);
                    setUserRole("unknown");
                }

              } catch (error) {
                console.error("Error checking admin role:", error);
                setUserRole("unknown");
              }
            } else {
                console.log("No user logged in");
                setUserRole("unknown");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    
    useEffect(() => {
        if (userRole === 'admin') {
        fetchBuses();
        fetchDrivers();
        fetchUsers();
        fetchBookings();
     }
    }, [userRole]);

    const fetchBuses = async () => {
        try {
        const querySnapshot = await getDocs(collection(db, "Buses"));
        setBuses(querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data})));
        } catch (error) {
            console.error("Error fetching buses:", error);

        }
    };

    const fetchDrivers = async () => {
        try {
        const querySnapshot = await getDocs(collection(db, "Drivers"));
        setDrivers(querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data})));
        } catch (error) {
            console.error("Error fetching drivers:", error);
        }
    };

    const fetchUsers = async () => {
        try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        setUsers(querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data})));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchBookings = async () => {
        try {
        const querySnapshot = await getDocs(collection(db, "Bookings"));
        setBookings(querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data})));
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const addBus =  async () => {
        if(!newBus.busNumber || !newBus.route || !newBus.driverId) {
            alert("Please fill all fields.");
            return;
        }
        try {
        await addDoc(collection(db, "Buses"), newBus);
        fetchBuses();
        setNewBus({busNumber: "", route: "", driverId: ""})
        } catch (error) {
            console.error("Error adding bus:", error);
        }
    };

    const deleteBus = async (id) => {
        try {
        await deleteDoc(doc(db, "Buses", id));
        fetchBuses();
        } catch (error) {
            console.error("Error deleting bus:", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (userRole !== "admin") return <p>Access denied. You are not an admin.</p>;

  return (
    <div className='admin-dashboard'>
        <h2>Admin Dashboard</h2>

        <div className='admin-section'>
            <h3>Buses</h3>
            <ul>
                {buses.map(bus => (
                    <li key={bus.id}>
                        {bus.busNumber} - {bus.route} - Driver: {bus.driverId}
                        <button onClick={() => deleteBus(bus.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h4>Add New Bus</h4>
            <input 
            type='text' 
            placeholder='Bus Number' 
            value={newBus.busNumber}
            onChange={e => setNewBus({...newBus, busNumber: e.target.value})}
            />
             <input 
            type='text' 
            placeholder='Route' 
            value={newBus.route}
            onChange={e => setNewBus({...newBus, route: e.target.value})}
            />
             <input 
            type='text' 
            placeholder='Driver ID' 
            value={newBus.driverId}
            onChange={e => setNewBus({...newBus, driverId: e.target.value})}
            />
            <button onClick={addBus} className='add-bus'>Add Bus</button>
        </div>

        <div className='admin-section'>
            <h3>Drivers</h3>
            <ul>
                {drivers.map(driver => (
                    <li key={driver.id}>{driver.name} - {driver.contact}</li>
                ))}
            </ul>
        </div>

        <div className='admin-section'>
            <h3>Users</h3>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} - {user.email}</li>
                ))}
            </ul>
        </div>

        <div className='admin-section'>
        <h3>Bookings</h3>
            <ul>
                {bookings.map(booking => (
                    <li key={booking.id}>
                        Bus {booking.busId} - {booking.bookedAt}
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default Admin;