import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from './api';
import { useNavigate } from 'react-router-dom';


const Research = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [vehicleImage, setVehicleImage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the available vehicles from your API (you should already have an endpoint for this)
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/vehicles`);
        setVehicles(response.data); // Assuming this response contains vehicle info
      } catch (err) {
        console.error('Error fetching vehicles', err);
      }
    };

    fetchVehicles();
  }, []);

  const handleVehicleSelect = (event) => {
    const vehicleId = event.target.value;
    setSelectedVehicleId(vehicleId);
    localStorage.setItem('selectedVehicleId', vehicleId);  // Save to localStorage

    // Check if an image exists for the vehicle (replace with actual image fetching logic)
    const imageUrl = `/images/${vehicleId}.png`;
    const image = new Image();
    image.onload = () => {
      setVehicleImage(imageUrl);  // If image is found
    };
    image.onerror = () => {
      setVehicleImage('/images/wip.png');  // Default image
    };
    image.src = imageUrl;
  };

  const handleResearchStart = async () => {
    try {
      const playerId = localStorage.getItem('playerId'); // Get player ID from localStorage
      if (!playerId || !selectedVehicleId) {
        setError('Please select a vehicle to research.');
        return;
      }

      // Make the API call to start the research
      const response = await axios.post(`${baseURL}/api/research`, {
        playerId,
        vehicleId: selectedVehicleId
      });

      console.log(response.data); // Handle the response (you can show a success message)
      navigate('/start');
    } catch (err) {
      console.error('Failed to start research', err);
      setError('Failed to start research');
    }
  };

  return (
    <div>
      <h1>Research a Vehicle</h1>

      <select onChange={handleVehicleSelect} value={selectedVehicleId}>
        <option value="">Select a Vehicle</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
            {vehicle.vehicle_name}
          </option>
        ))}
      </select>

      <button onClick={handleResearchStart}>Start Research</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display vehicle image */}
      {vehicleImage && <img src={vehicleImage} alt="Vehicle" />}
    </div>
  );
};

export default Research;
