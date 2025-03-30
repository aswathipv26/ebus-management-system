import React, { useEffect, useState } from 'react';
import {db} from '../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './BusList.css';
import BusCard from '../../components/BusCard/BusCard';

const BusList = () => {
    const [buses, setBuses] = useState([]);
   

    useEffect(() => {
        const fetchBuses = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "Buses"));
            const busList = querySnapshot.docs.map(doc => ({
              id: doc.id, 
              ...doc.data(), 
            }));
            setBuses(busList);
          } catch (error) {
            console.error("Error fetching buses:", error);
          }
        };
    
        fetchBuses();
      }, []);

  return (
    <div className='bus-list-container'>
    <h2>Available Buses</h2>
    <div className='bus-list'>
    {buses.length > 0 ? (
          buses.map(bus => <BusCard key={bus.id} bus={bus} />)
        ) : (
          <p>No buses available.</p>
        )}
    </div>
  
</div>
  );
};

export default BusList;