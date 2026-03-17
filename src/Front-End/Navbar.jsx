import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    // 1. Confirmation Alert
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    
    if (confirmLogout) {
      // 2. Agar user 'OK' dabaye to session clear karein
      console.log("Logging out...");
      
      // Yahan aap localStorage.clear() ya auth logic daal sakte hain
      // localStorage.removeItem("token"); 

      // 3. Wapas Login/Signup page par bhej dein
      navigate("/signup"); 
    }
    // Agar 'Cancel' dabaya to kuch nahi hoga, user wahi rahega.
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
              <div className="bg-green-500 p-2 rounded-full group-hover:rotate-[360deg] transition-all duration-700 shadow-md shadow-green-200">
                <span className="text-2xl">🏏</span>
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-gray-800">
                BOX<span className="text-green-600 underline decoration-green-300">CRICKET</span>
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/homen" className="text-gray-600 hover:text-green-600 font-bold transition-colors relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/my-matches" className="text-gray-600 hover:text-green-600 font-bold transition-colors relative group">
              My Matches
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full"></span>
            </Link>
             <Link to="/playermap" className="text-gray-600 hover:text-green-600 font-bold transition-colors relative group">
              Group
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/findplayer" className="text-gray-600 hover:text-green-600 font-bold transition-colors relative group">
              Find
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full"></span>
            </Link>

            {/* Logout Button with Animation & Icon */}
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-2 bg-red-500 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Logout</span>
              <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" height="20" viewBox="0 0 24 24" 
                  fill="none" stroke="currentColor" strokeWidth="2.5" 
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 focus:outline-none p-2"
            >
              <div className={`w-6 h-1 bg-green-600 mb-1 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-1 bg-green-600 mb-1 ${isOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-1 bg-green-600 transition-all ${isOpen ? '-rotate-45 -translate-y-0.5' : ''}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} md:hidden overflow-hidden transition-all duration-500 bg-green-50`}>
        <div className="px-4 pt-2 pb-6 space-y-2 border-t border-green-100">
          <Link 
            to="/Homen" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-3 rounded-md text-base font-bold text-gray-700 hover:bg-green-500 hover:text-white transition-all"
          >
            Home
          </Link>
          <Link 
            to="/my-matches" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-3 rounded-md text-base font-bold text-gray-700 hover:bg-green-500 hover:text-white transition-all"
          >
            My Matches
          </Link>
          
          {/* Mobile Logout Button */}
          <button 
            onClick={(Login) => { handleLogout(); setIsOpen(false); }}
            className="w-full mt-2 bg-red-500 text-white py-3 rounded-lg font-bold shadow-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;