import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Toast import kiya

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // --- LOGOUT LOGIC WITH TOAST ---
  const handleLogout = () => {
    const confirmLogout = window.confirm("Leaving the pitch? Are you sure you want to logout?");
    
    if (confirmLogout) {
      localStorage.removeItem("token"); 
      
      // Gazab ka Toast Message
      toast.success('Successfully Logged Out! See you soon Champion! 🏏', {
        duration: 3000,
        style: {
          border: '2px solid #22c55e',
          padding: '16px',
          color: '#166534',
          fontWeight: 'bold',
        },
      });

      // 1.5 sec baad redirect
      setTimeout(() => {
        navigate("/signup");
      }, 1500);
    }
  };

  return (
    <>
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-4 border-green-500 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            
            {/* Logo Section - With Spin Effect */}
            <Link to="/" className="flex items-center group">
              <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
                <div className="bg-gradient-to-tr from-green-600 to-green-400 p-2.5 rounded-2xl group-hover:rotate-[360deg] transition-all duration-700 shadow-xl shadow-green-200">
                  <span className="text-2xl drop-shadow-md">🏏</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black italic tracking-tighter text-gray-800 leading-none">
                    BOX<span className="text-green-600 underline decoration-yellow-400 decoration-4">CRICKET</span>
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Ahmedabad</span>
                </div>
              </div>
            </Link>

            {/* Desktop Menu - With Crease Animation */}
            <div className="hidden md:flex items-center space-x-6">
              {[
                { name: 'Home', path: '/homen' },
                { name: 'My Matches', path: '/my-matches' },
                { name: 'Group', path: '/playermap' },
                { name: 'Find', path: '/findplayer' }
              ].map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className="text-gray-600 hover:text-green-600 font-black uppercase text-sm tracking-widest transition-all relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-yellow-400 transition-all group-hover:w-full"></span>
                </Link>
              ))}

              {/* Logout Button - Pro Look */}
              <button 
                onClick={handleLogout}
                className="group relative flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-red-600 transition-all active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">Logout</span>
                <svg 
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" height="18" viewBox="0 0 24 24" 
                  fill="none" stroke="currentColor" strokeWidth="3" 
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-green-600 focus:outline-none p-2 bg-green-50 rounded-xl"
              >
                <div className={`w-7 h-1 bg-green-600 mb-1.5 transition-all ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></div>
                <div className={`w-7 h-1 bg-green-600 mb-1.5 ${isOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-7 h-1 bg-green-600 transition-all ${isOpen ? '-rotate-45 -translate-y-0' : ''}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Smooth Glass Effect */}
        <div className={`${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} md:hidden overflow-hidden transition-all duration-500 bg-white border-t-2 border-green-100`}>
          <div className="px-6 py-8 space-y-4">
            {['Home', 'My Matches', 'Groups', 'Find'].map((item) => (
               <Link 
                key={item}
                to={`/${item.toLowerCase().replace(' ', '')}`} 
                onClick={() => setIsOpen(false)}
                className="block text-xl font-black italic text-gray-700 hover:text-green-600 hover:translate-x-3 transition-all uppercase"
              >
                {item}
              </Link>
            ))}
            
            <button 
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl mt-4"
            >
              Logout Session
            </button>

            {/* FOUNDER CARD (Responsive & Stylish) */}
            <div className="mt-8 p-5 bg-gradient-to-br from-green-50 to-white rounded-[2rem] border-2 border-green-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center text-white font-black shadow-lg">
                  AC
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Founder & CEO</p>
                  <p className="text-base font-black text-gray-800 italic">Ahmedabadi <span className="text-green-600">Cricketer</span></p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-100 space-y-2">
                <p className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                  <span className="text-green-500">📞</span> +91 82007 92488
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                  <span className="text-green-500">✉️</span> play@boxcricket.in
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;