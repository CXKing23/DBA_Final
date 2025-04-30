import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from './api';
import './PlayerStats.css'; // Add this line at the top of your React component file
 


const PlayerStats = ({ playerId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/player-stats/${playerId}`);
        setStats(response.data); // Update the stats state
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
    };
    if (playerId) {
      fetchStats();
    }
  }, [playerId]);

  if (!stats) {
    return <p>Loading stats...</p>;
  }

  return (
    <div className="player-stats">
  <h3>Your Stats</h3>
  <ul>
    <li><span className="stat-label">Player Name:</span> <span className="stat-value">TankMaster22</span></li>
    <li><span className="stat-label">Research Points:</span> <span className="stat-value">120</span></li>
    <li><span className="stat-label">Level:</span> <span className="stat-value">12</span></li>
    <li><span className="stat-label">Battles Fought:</span> <span className="stat-value">50</span></li>
    <li><span className="stat-label">Victories:</span> <span className="stat-value">30</span></li>
  </ul>
</div>

  );
};

export default PlayerStats;
