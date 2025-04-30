import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from './StartPage';
import PlayerStats from './PlayerStats';
import Research from './Research';
import Squadrons from './Squadrons';
import LoginPage from './LoginPage';

const App = () => {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const playerId = localStorage.getItem('playerId');
  return (
    <Router>
      <Routes>
        {/* LoginPage: Set player ID after login */}
        <Route path="/" exact element={<LoginPage setSelectedPlayerId={setSelectedPlayerId} />} />

        {/* StartPage: Show options after login */}
        <Route path="/start" exact element={<StartPage selectedPlayerId={selectedPlayerId} />} />

        {/* PlayerStats: Display selected player's stats */}
        <Route path="/player-stats" element={<PlayerStats playerId={playerId} />} />

        {/* Other routes */}
        <Route path="/research" element={<Research />} />
        <Route path="/squadrons" element={<Squadrons />} />
      </Routes>
    </Router>
  );
}

export default App;
