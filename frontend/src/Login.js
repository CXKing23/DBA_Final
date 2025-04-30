import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Login = ({ setPlayerId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Fetch users (excluding admins) on load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users');
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleLogin = () => {
    if (password !== '1234') {
      setError('Incorrect password.');
      return;
    }

    const user = users.find(u => u.username === selectedUser);
    if (user) {
      setPlayerId(user.player_id);
      setError('');
    } else {
      setError('User not found.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
        <option value="">Select Username</option>
        {users.map(user => (
          <option key={user.player_id} value={user.username}>
            {user.username}
          </option>
        ))}
      </select>

      <input
        type="password"
        placeholder="Password (1234)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
