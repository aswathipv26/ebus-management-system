import React from 'react';
import {db} from '../../firebase/firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './BusCard.css';

const BusCard = ({bus}) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  const handleBooking = async () => {
   
    if (!user) {
      alert("Please log in to book a seat.");
      return;
    }

    try {
      const busQuery = query(collection(db, "Buses"), where("busId", "==", bus.busId));
      const busSnapshot = await getDoc(busQuery);

      if (busSnapshot.empty) {
        alert("Bus not found");
        return;
      }

      const busDoc = busSnapshot.docs[0];
      const busRef = doc(db, "Buses", busDoc.id);
      const busData = busDoc.data();
      const availableSeats = busData.availableSeats;
      if (availableSeats <= 0) {
        alert("No available seats");
        return;
      }

      const seatNumber = `Seat-${availableSeats}`;
      const bookingId = `BK${Date.now()}`;

      await addDoc(collection(db, "Bookings"), {
        bookingId: bookingId,
        userId: user.uid,
        busId: bus.busId,
        busNumber: bus.busNumber,
        busName: bus.busName,
        fromLocation: bus.fromLocation,
        toLocation: bus.toLocation,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        busType: bus.busType,
        availableSeats: bus.availableSeats,
        ticketPrice: bus.ticketPrice,
        totalDuration: bus.totalDuration,
        seatNumber: seatNumber,
        status: "Confirmed",
        bookedAt: new Date().toISOString,
      });

      await updateDoc(busRef, {
        availableSeats: availableSeats-1,
      });

      alert(`Booking successful! Your seat: ${seatNumber}`);

    } catch (error) {
      console.error("Booking Failed:", error);
    }
  };

  return (
    <div className='bus-card'>
         <h3>{bus.busNumber}</h3>
        <h2>{bus.busName}</h2>
        <p><strong>Bus ID:</strong> {bus.busId}</p>  
        <p><strong>Type:</strong> {bus.busType}</p>
        <p><strong>Route:</strong> {bus.fromLocation} → {bus.toLocation}</p>
        <p><strong>Departure:</strong> {new Date(bus.departureTime).toLocaleString()}</p>
        <p><strong>Arrival:</strong> {new Date(bus.arrivalTime).toLocaleString()}</p>
        <p><strong>Duration:</strong> {bus.totalDuration}</p>
        <p><strong>Available Seats:</strong> {bus.availableSeats}</p>
        <p><strong>Price:</strong> ₹{bus.ticketPrice}</p>
        <button onClick={handleBooking} disabled={bus.availableSeats <= 0}> 
           {bus.availableSeats > 0 ? "Book Now" : "Sold Out"}
        </button>
    </div>
  );
};

export default BusCard; 