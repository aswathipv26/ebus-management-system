import React, { useEffect, useState } from 'react';
import {db} from '../../firebase/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TrackBus.css';

const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/256/3448/3448339.png',
    iconSize: [30, 30], 
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
})

const TrackBus = () => {
    const [busLocations, setBusLocations] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "BusLocations"), (snapshot) => {
            const buses = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBusLocations(buses)
        });
       
        return() =>  unsubscribe();
    }, []);


  return (
    <div className='track-bus'>
        <h2>Live Bus Tracker</h2>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} 
        style={{height: "500px", width: "100%"}}
        >
            <TileLayer 
            url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {busLocations.map((bus => 
                bus.location && bus.location.latitude && bus.location.longitude ? (
                    <Marker key={bus.id} position={[bus.location.latitude, bus.location.longitude]} icon={busIcon}>
                        <Popup>
                        <b>Bus:</b> {bus.busNumber} <br />
                        <b>Last Updated:</b> {bus.lastUpdated ? new Date(bus.lastUpdated.seconds * 1000).toLocaleString() : "N/A"}
                        </Popup>
                    </Marker>
                ) : null
           ))}
        </MapContainer>
    </div>
  );
};;

export default TrackBus;