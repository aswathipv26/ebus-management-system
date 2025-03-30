import React, { useEffect, useState } from 'react';
import {db} from '../../firebase/firebaseConfig';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import './LocationTracker.css';

const LocationTracker = () => {
    const busId = useParams();
    const [location, setLocation] = useState({lat: null, lng: null});
    const [error, setError] = useState(null);

    useEffect(() => {
        if(!busId) {
          console.error("Bus ID is missing");
          setError("Bus ID is missing");
          return;
        }

        console.log("Tracking location for bus:", busId);
          

        const successCallback = async (position) => {
            const {latitude, longitude} = position.coords;
            console.log("Location received:", latitude, longitude);

            setLocation({lat: latitude, lng: longitude});

           try {
            const busRef = doc(db, "BusLocations", busId)
              await updateDoc(busRef,  {
              location: { latitude, longitude},
              lastUpdated: serverTimestamp(),
          });
          } catch(err) {
            console.error("Error updating location in Firestore:", err);
            setError("Failed to update location");
          }
        };

        const errorCallback = (err) => {
          console.error("Geolocation error:" +err.message);
            setError("Error getting location:" + err.message);
        };

        const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 10000
        });
        return () => navigator.geolocation.clearWatch(watchId);
    }, [busId]);

 
  return (
    <div>
      {error && <p className='error'>{error}</p>}
      {location.lat && location.lng ? (
        <p>Current Location: {location.lat}, {location.lng}</p>
      ) : (
        <p>Fetching Location...</p>
      )}
    </div>
  );
};

export default LocationTracker;