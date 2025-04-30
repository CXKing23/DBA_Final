// api.js

// Function to get the list of vehicles from the backend
export const getVehicles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vehicles'); // Adjust the URL as needed
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      const data = await response.json();
      return data; // Return the vehicle data from the response
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error; // Propagate the error so it can be handled in the component
    }
  };
  
  // Function to update research points for a player and vehicle
  export const updateResearchPoints = async (playerId, vehicleId) => {
    try {
      const response = await fetch('http://localhost:5000/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, vehicleId }), // Send the data as JSON
      });
  
      if (!response.ok) {
        throw new Error('Failed to update research points');
      }
  
      const data = await response.json();
      return data; // Return the success response from the backend
    } catch (error) {
      console.error('Error updating research points:', error);
      throw error; // Propagate the error for further handling in the component
    }
  };
  export const baseURL = "http://localhost:5000"