import express from 'express'
import config from './config.js'
import mysql from 'mysql2/promise'
import cors from 'cors'


// Initialize Express app
const app = express();


// Middleware for parsing JSON and handling CORS
app.use(express.static('static'))
app.use(express.json());
app.use(cors());

const connection = await mysql.createConnection(config.db)


connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});


// Route to fetch all vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const [results] = await connection.query('SELECT * FROM Tanks');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});


// Route to update research points for a player
// API route to handle research actions
app.post('/api/research', async (req, res) => {
  const connection = await mysql.createConnection(config.db); // Ensure you have a valid DB connection

  try {
    const { playerId, vehicleId } = req.body;

    // Start a transaction
    await connection.beginTransaction();

    // Delete any existing record with the same playerId
    const deleteQuery = 'DELETE FROM research WHERE player_id = ?';
    await connection.query(deleteQuery, [playerId]);

    // Insert the new research record
    const insertQuery = 'INSERT INTO research (player_id, vehicle_id, start_time, is_completed) VALUES (?, ?, NOW(), 0)';
    const [result] = await connection.query(insertQuery, [playerId, vehicleId]);

    // Commit the transaction
    await connection.commit();

    res.status(200).json({ success: 'Research started successfully!', playerId: playerId, vehicleId: vehicleId });
  } catch (err) {
    // Rollback the transaction in case of error
    await connection.rollback();

    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to start research' });
  } finally {
    // Close the connection after the operation
    await connection.end();
  }
});

app.get('/api/vehicle-name/:vehicleId', async (req, res) => {
  const { vehicleId } = req.params;
  try {
    const [results] = await connection.query(
      'SELECT vehicle_name FROM tanks WHERE vehicle_id = ?',
      [vehicleId]
    );
    if (results.length > 0) {
      res.json({ name: results[0].vehicle_name });
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});



// Example route in your Express backend (server.js)
app.get('/api/vehicle/:playerId', async (req, res) => {
  const playerId = req.params.playerId;

  try {
    const [results] = await connection.query(
      'SELECT vehicle_id FROM research WHERE player_id = ?',
      [playerId]
    );
    
    if (results.length > 0) {
      const vehicleId = results[0].vehicle_id;
      res.json({ vehicle_id: vehicleId });
    } else {
      res.status(404).json({ error: 'Player not found or no vehicle assigned.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});



app.get('/api/users', async (req, res) => {
  try {
    const [results] = await connection.query(
      "SELECT player_id, username FROM Players WHERE role = 'user'"
    );
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});
app.get('/api/player-stats/:playerId', async (req, res) => {
  const playerId = req.params.playerId;
  try {
    const [rows] = await connection.query(
      `SELECT p.player_id, p.username, ps.research_points, ps.level, ps.battles_fought, ps.victories
       FROM Players p
       JOIN PlayerStats ps ON p.player_id = ps.player_id
       WHERE p.player_id = ?`,
      [playerId]
    );
    res.json(rows[0]); // Return single result
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
});



// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
