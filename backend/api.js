// api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Fetch vehicles from the backend
export const getVehicles = async () => {
  try {
    const response = await axios.get(`${API_URL}/vehicles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
};

// Send research data (e.g., when player selects a vehicle to research)
export const updateResearchPoints = async (playerId, vehicleId) => {
  try {
    const response = await axios.post(`${API_URL}/research`, { playerId, vehicleId });
    return response.data;
  } catch (error) {
    console.error('Error updating research points:', error);
    return { error: 'Failed to update research points' };
  }
};
