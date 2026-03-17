import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link yahan se import hoga

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

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
            Find the best Box Cricket matches in Ahmedabad. Connect with players and experience the game like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/signup")} 
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-12 py-5 rounded-full font-bold text-xl shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Explore Features
            </button>
            <button 
              onClick={() => navigate("/signup")}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-12 py-5 rounded-full font-bold text-xl transition-all"
            >
              Book Now
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1">
            <h2 className="text-2xl font-black italic text-green-500 mb-4 tracking-tighter">
              BOX<span className="text-white">CRICKET</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Ahmedabad's premier platform for box cricket enthusiasts.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-yellow-400">Navigation</h3>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link to="/matches" className="hover:text-white transition-colors">Find Matches</Link></li>
              <li><Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-yellow-400">Support</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>📍 Sindhu Bhavan Rd, Ahmedabad</li>
              <li>📞 +91 98765 43210</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-yellow-400">Newsletter</h3>
            <div className="flex flex-col gap-2">
              <input type="email" placeholder="Your Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2" />
              <button className="bg-green-500 text-black font-bold py-2 rounded-lg">Subscribe</button>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR WITH REACT-ROUTER LINKS */}
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4 text-gray-500 text-[10px] uppercase tracking-[0.2em]">
          <p>© 2026 Box Cricket Ahmedabad. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link 
              to="/privacy-policy" 
              className="hover:text-green-500 transition-colors duration-300 cursor-pointer"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="hover:text-green-500 transition-colors duration-300 cursor-pointer"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;