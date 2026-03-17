import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Trophy, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => { setLoaded(true); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- UPDATED VALIDATION LOGIC ---
  const handleValidation = (e) => {
    e.preventDefault(); // Form reload ya direct navigation roko

    const savedUser = JSON.parse(localStorage.getItem("userCredentials"));

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    if (!savedUser) {
      toast.error("No account found. Sign up first!");
      return;
    }

    if (formData.email === savedUser.email && formData.password === savedUser.password) {
      // 1. Success Message dikhao
      toast.success("Login Successful! Redirecting...");
      
      localStorage.setItem("isLoggedIn", "true");

      // 2. Thoda wait karo (1.5 sec) taaki user toast dekh sake
      setTimeout(() => {
        navigate("/homen");
      }, 1500);
      
    } else {
      toast.error("Invalid credentials!");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Toaster container (z-index ensure karta hai ki ye top par dikhe) */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className={`relative z-10 w-full max-w-md p-6 transition-all duration-1000 transform ${loaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
          
          <div className="text-center mb-10">
            <Trophy className="text-yellow-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-4xl font-black text-white italic uppercase">Welcome <span className="text-green-500">Back</span></h2>
          </div>

          <form onSubmit={handleValidation} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                name="email"
                type="email" 
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-yellow-500/50 transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-14 pr-14 text-white focus:outline-none focus:border-yellow-500/50 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* --- Notification Icon --- */}
{/* <div className="relative group cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-all duration-300">
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" 
    strokeLinecap="round" strokeLinejoin="round" 
    className="text-gray-600 group-hover:text-green-600 group-hover:rotate-12 transition-transform"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
  {/* Red Dot with Ping Animation */}
  {/* <span className="absolute top-2 right-2 flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
  </span>
</div> */} 

{/* --- User Profile Avatar --- */}
{/* <div className="flex items-center gap-3 pl-4 border-l border-gray-200 group cursor-pointer">
  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-600 to-green-400 flex items-center justify-center text-white font-bold shadow-md transform transition-all group-hover:scale-110 group-hover:shadow-green-200">
    A
  </div>
  <div className="hidden lg:block">
    <p className="text-xs text-gray-400 font-medium">Welcome,</p>
    <p className="text-sm font-bold text-gray-800 leading-tight">Ahmedabadi</p>
  </div>
</div> */}

{/* Available Matches Section ke andar ye card dalo */}
{/* <div className="bg-white p-5 rounded-[2rem] shadow-xl border border-gray-100 hover:border-green-400 transition-all group">
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="text-xl font-black text-gray-800 italic uppercase">Decathlon Applewoods</h3>
      <p className="text-gray-500 flex items-center gap-1 text-sm font-medium">
        📍 SG Highway, Ahmedabad
      </p>
    </div>
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
      Live
    </span>
  </div>
  </div> */}

  {/* <div className="flex gap-4 mb-6">
    <div className="bg-slate-50 p-3 rounded-2xl flex-1 text-center">
      <p className="text-[10px] uppercase text-gray-400 font-bold">Time</p>
      <p className="font-black text-slate-700">08:30 PM</p>
    </div>
    <div className="bg-slate-50 p-3 rounded-2xl flex-1 text-center">
      <p className="text-[10px] uppercase text-gray-400 font-bold">Fee</p>
      <p className="font-black text-green-600">₹200</p>
    </div>
  </div>

  <button className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-green-600 transition-all shadow-lg active:scale-95">
    Join Match
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  </button>
</div> */}

            {/* BUTTON USE KIYA HAI LINK KI JAGAH */}
            <button 
              type="submit"
              className="group w-full bg-green-500 hover:bg-green-400 text-black font-black text-xl py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 uppercase tracking-widest transition-all active:scale-95"
            >
              Login Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => navigate("/signup")} className="text-yellow-400 font-bold underline">Don't have an account? Sign Up</button>
          </div>
          </div></div></div>
    
    
  );
};

export default Login;