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
        {/* Navbar hamesha Routes ke bahar rahega taaki har page pe dikhe */}
        <Navbar /> 
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matchcard" element={<MatchCard />} />
          <Route path="/matchform" element={<MatchForm />} />
          <Route path="/homen" element={<Homen />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Yahan path ko Navbar ke Link se match karein */}
          <Route path="/my-matches" element={<MyMatches />} /> 
          <Route path="/mymatches" element={<MyMatches />} />
          <Route path="/Playermap" element={<PlayerMap/>} />
          <Route path="/matchdetails" element={<MatchDetails/>} />
          <Route path="/findplayer" element={<FindPlayer/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;