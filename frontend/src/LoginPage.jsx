import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseURL } from './api';
import './LoginPage.css'; // Add this line at the top of your React component file


const LoginPage = () => {
  const [users, setUsers] = useState([]); // List of users fetched from backend
  const [selectedUserId, setSelectedUserId] = useState(''); // Selected user ID
  const [password, setPassword] = useState(''); // Password field
  const [error, setError] = useState(''); // Error message if login fails
  const navigate = useNavigate(); // For navigation after login
  
  useEffect(() => {
    // Fetching users from the backend when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/users`);
        setUsers(response.data); // Set the list of users from the API
      } catch (err) {
        console.error('Failed to fetch users:', err); // Log error if fetch fails
      }
    };

    fetchUsers(); // Call the function to fetch users
  }, []);

  const handleLogin = () => {
    // Validate login: Check if password is correct and user is selected
    if (password === '1234' && selectedUserId) {
      // Save selected user info (ID) to local storage
      localStorage.setItem('playerId', selectedUserId);
      // Navigate to the start page after login
      navigate('/start');
    } else {
      // Show error message if login fails
      setError('Invalid login. Try again.');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>

      {/* Dropdown to select a user */}
      <select
        onChange={(e) => setSelectedUserId(e.target.value)} // Set selected user ID
        value={selectedUserId} // Controlled value of the dropdown
      >
        <option value="">Select Username</option>
        {/* Map through users and display their usernames */}
        {users.map(user => (
          <option key={user.player_id} value={user.player_id}>
            {user.username}
          </option>
        ))}
      </select>

      {/* Password input */}
      <input
        type="password"
        placeholder="Enter password"
        value={password} // Controlled value of the password input
        onChange={(e) => setPassword(e.target.value)} // Update password state
      />

      {/* Login button */}
      <button onClick={handleLogin}>Login</button>

      {/* Error message if login fails */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
