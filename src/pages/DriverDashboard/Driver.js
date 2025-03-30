import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth, db} from '../../firebase/firebaseConfig';
import { collection, query, where, getDocs, getDoc, doc, updateDoc} from 'firebase/firestore';
import './Driver.css';

const Driver = () => {
    const [assignedBuses, setAssignedBuses] = useState([]);
    const [bookingRequests, setBookingRequests] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Authenticated user:", user);
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const role = userDoc.data().role;
                        console.log("User Role from Firestore:", role);
                        setUserRole(role);
                        if (role === "driver") {
                            fetchAssignedBuses(user.uid);
                            fetchBookingRequests();
                        }
                    } else {
                        console.log("No user document found!");
                        setUserRole("unknown");
                    }
                } catch (error) {
                    console.error("Error checking user role:", error);
                    setUserRole("unknown");
                }
            } else {
                console.log("No user logged in.");
                setUserRole("unknown");
            }
            setLoading(false);
        });

        return () => unsubscribe(); 
    }, []);

        const fetchAssignedBuses = async (driverId) => {
            try {
            const q = query(collection(db, 'buses'), where('driverId', '==', driverId));
            const querySnapshot = await getDocs(q);
            setAssignedBuses(querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
            } catch (error) {
                console.error("Error fetching assigned buses:", error);
            }
        };

        const fetchBookingRequests = async () => {
            try {
                const q = query(collection(db, 'bookingRequests'), where('status', '==', 'pending'));
                const querySnapshot = await getDocs(q);
                setBookingRequests(querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
            } catch (error) {
                console.error("Error fetching booking requests:", error);
            }
        };

        const handleBookingStatus = async (bookingId, status) => {
            try {
               await updateDoc(doc(db, "bookingRequest", bookingId), {status});
               setBookingRequests(prevRequests => prevRequests.filter(booking => booking.id !== bookingId));
            } catch (error) {
                console.error("Error updating booking status:", error);
            }
        };

        if (loading) return <p>Loading...</p>;
        if (userRole !== "driver") return <p>Access denied. You are not a driver.</p>;

  return (
    <div className='driver-dashboard'>
        <h2>Driver Dashboard</h2>
            <h3>Assigned Buses</h3>
            {assignedBuses.length > 0 ? (
                <ul>
                    {assignedBuses.map(bus => (
                        <li key={bus.id}>{bus.busName} - {bus.route}</li>
                    ))}
                </ul>
            ) : (
                <p>No assigned buses</p>
            )}
            
           
        <div className='booking-requests'>
           {bookingRequests.length > 0 ? (
            <ul>
                {bookingRequests.map(request => (
                    <li key={request.id}>
                        {request.passengerName} - {request.pickupLocation} - {request.status}
                        <button onClick={() => handleBookingStatus(request.id, 'approved')}>Approve</button>
                        <button onClick={() => handleBookingStatus(request.id, 'rejected')}>Reject</button>
                    </li>    
                ))}
            </ul>
           ) : (
            <p>No booking requests.</p>
           )}
        </div>
    </div>
  );
};

export default Driver;