import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Instagram, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  // Mock Authentication State (In a real app, get this from Context or Redux)
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  // --- PROTECTED NAVIGATION LOGIC ---
  const handleProtectedAction = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      // Alert user or directly redirect to signup
      alert("Please Sign Up / Login to access this feature!");
      navigate("/signup");
    }
  };

  return (
    <div className={`min-h-screen bg-white transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="Cricket Ground"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-slate-950/90 z-10"></div>
        </div>

        <div className={`relative z-20 px-6 max-w-5xl transition-all duration-1000 delay-300 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-6xl md:text-8xl font-extrabold italic tracking-tighter mb-6 leading-tight">
            <span className="text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">PLAY</span> 
            <span className="text-green-500"> ANYTIME,</span> 
            <br /> 
            <span className="text-white">ANYWHERE</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Find the best Box Cricket matches in Ahmedabad.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* These buttons now check for login */}
            <button 
              onClick={() => handleProtectedAction("/matches")} 
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-12 py-5 rounded-full font-bold text-xl shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Explore Features
            </button>
            <button 
              onClick={() => handleProtectedAction("/book")}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-12 py-5 rounded-full font-bold text-xl transition-all"
            >
              Book Now
            </button>
          </div>
        </div>
      </section>

      {/* --- PREMIUM RESPONSIVE FOOTER --- */}
<footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
  {/* Soft Background Glow */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] -z-10"></div>

  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
      
      {/* 1. Brand & About */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black italic tracking-tighter text-green-500">
          BOX<span className="text-white">CRICKET</span>
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
          Ahmedabad's dedicated platform for box cricket lovers. Book your slot, find your team, and start playing.
        </p>
       {/* --- MODERN SOCIAL BUTTONS --- */}
<div className="flex gap-4 pt-4">
  {/* Instagram Button */}
  <a 
    href="https://www.instagram.com/rudra_creation_0777/" // Apna link yahan dalein
    target="_blank" 
    rel="noopener noreferrer"
    className="group flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-gradient-to-tr hover:from-[#f09433] hover:to-[#bc1888] hover:border-transparent transition-all duration-500 shadow-lg hover:shadow-pink-500/20"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500 group-hover:text-white transition-colors">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
    <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-white transition-colors">Instagram</span>
  </a>

  {/* WhatsApp Button */}
  <a 
    href="https://wa.me/8200792488" // Aapka number link ke saath
    target="_blank" 
    rel="noopener noreferrer"
    className="group flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-green-600 hover:border-transparent transition-all duration-500 shadow-lg hover:shadow-green-500/20"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 group-hover:text-white transition-colors">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
    <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-white transition-colors">WhatsApp</span>
  </a>
</div>
      </div>

      {/* 2. Navigation (No Login Protection Here) */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-yellow-500 mb-6">Quick Links</h3>
        <ul className="grid grid-cols-2 gap-4">
          <li><Link to="/homen" className="text-gray-400 hover:text-white text-sm transition-colors">Home</Link></li>
          <li><Link to="/findplayer" className="text-gray-400 hover:text-white text-sm transition-colors">Find Player</Link></li>
          <li><Link to="/playermap" className="text-gray-400 hover:text-white text-sm transition-colors">Groups</Link></li>
          <li><Link to="/my-matches" className="text-gray-400 hover:text-white text-sm transition-colors">My Matches</Link></li>
        </ul>
      </div>

      {/* 3. Founder & Contact Profile */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center text-black font-black text-xl shadow-lg">
            AC
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Founder</p>
            <p className="text-base font-black text-white italic">
              Gelot <span className="text-green-500"> Rudra

              </span>
            </p>
          </div>
        </div>
        
        <ul className="space-y-3 pt-4 border-t border-white/5">
          <li className="flex items-center gap-3 text-sm text-gray-400">
            <span className="text-green-500">📞</span> +91 8200792488
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-400">
            <span className="text-green-500">✉️</span> play@boxcricket.in
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-400">
            <span className="text-green-500">📍</span> Ahmedabad, Gujarat
          </li>
        </ul>
      </div>

    </div>

    {/* Bottom Bar */}
    <div className="mt-16 pt-8 border-t border-white/5 text-center md:text-left flex flex-col md:row justify-between items-center gap-4">
      <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
        © 2024 Box Cricket Ahmedabad | Built by Ahmedabadi Cricketer
      </p>
    </div>
  </div>
</footer>
</div>
  );
};

export default Home;