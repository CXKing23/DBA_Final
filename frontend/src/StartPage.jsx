import React, { useState, useEffect } from 'react';
import { getVehicles, updateResearchPoints } from './api';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate for logout
import './StartPage.css';
import { baseURL } from './api';

import PlayerStats from './PlayerStats';
import Squadrons from './Squadrons';

const StartPage = () => {
  const [vehicleImage, setVehicleImage] = useState(null);
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleId, setVehicleId] = useState(null);
  const playerId = localStorage.getItem('playerId');
  const navigate = useNavigate();

  useEffect(() => {
    if (playerId) {
      const fetchVehicleId = async () => {
        try {
          const response = await fetch(`${baseURL}/api/vehicle/${playerId}`);
          const data = await response.json();
          if (data.vehicle_id) {
            setVehicleId(data.vehicle_id);
          } else {
            setVehicleId(null);
          }
        } catch (err) {
          console.error("Error fetching vehicle ID:", err);
        }
      };
      fetchVehicleId();
    }
  }, [playerId]);

  useEffect(() => {
    if (vehicleId) {
      const imageUrl = `/images/${vehicleId}.png`;
      const image = new Image();
      image.onload = () => setVehicleImage(imageUrl);
      image.onerror = () => setVehicleImage('/images/wip.png');
      image.src = imageUrl;

      const fetchVehicleName = async () => {
        try {
          const response = await fetch(`${baseURL}/api/vehicle-name/${vehicleId}`);
          const data = await response.json();
          setVehicleName(data.name);
        } catch (err) {
          console.error("Error fetching vehicle name:", err);
          setVehicleName('Unknown Vehicle');
        }
      };
      fetchVehicleName();
    } else {
      setVehicleImage('/images/wip.png');
      setVehicleName('');
    }
  }, [vehicleId]);

  const handleLogout = () => {
    localStorage.removeItem('playerId');
    navigate('/');
  };

  return (
    <div className="start-page">
      {/* Header buttons */}
      <div className="top-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button onClick={() => alert('Entering battle...')} className="battle-button">To Battle</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <h1>Welcome to Your War Thunder Database</h1>

      <div className="grid-container">
        <div className="grid-item">
          <Link to="/player-stats">
            <p>Your Stats</p>
          </Link>
          <PlayerStats playerId={playerId} id="player-stats" />
        </div>

        <div className="grid-item">
          <Link to="/research"><h2>Research</h2></Link>
          <h3>Currently Researching Vehicle:</h3>
          {vehicleImage ? (
            <>
              <img src={vehicleImage} alt="Selected Vehicle" className="vehicle-image" />
              <p><strong>{vehicleName}</strong></p>
            </>
          ) : (
            <p>Loading vehicle image...</p>
          )}
        </div>

        <div className="grid-item">
          <h2>Squadrons</h2>
          <Link to="/squadrons">
            <Squadrons />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
