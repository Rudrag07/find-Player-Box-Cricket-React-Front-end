import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Front-End/Navbar'; 
import Home from './Front-End/Home';     
import MatchCard from './Front-End/MatchCard';
import MatchForm from './Front-End/MatchForm';
import Homen from './Front-End/Homen';
import Signup from './Front-End/Signup';
import Login from './Front-End/Login';
import MyMatches from './Front-End/MyMatches';
import PlayerMap from './Front-End/PlayerMap';
import MatchDetails from './Front-End/MatchDetails';
import FindPlayer from './Front-End/FindPlayer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* Navbar sab page pe dikhega */}
        <Navbar /> 
        
        <Routes>
          {/* Ab saare pages visitor dekh sakta hai */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/homen" element={<Homen />} />
          <Route path="/my-matches" element={<MyMatches />} />
          <Route path="/matchcard" element={<MatchCard />} />
          <Route path="/matchform" element={<MatchForm />} />
          <Route path="/Playermap" element={<PlayerMap/>} />
          <Route path="/matchdetails" element={<MatchDetails/>} />
          <Route path="/findplayer" element={<FindPlayer/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;