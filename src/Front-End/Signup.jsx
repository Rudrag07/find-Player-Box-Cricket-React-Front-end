import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, User, Lock, Phone, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Button loading state
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "" // New Field
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { setLoaded(true); }, []);

  // Password strength check karne ke liye simple logic
  const getPasswordStrength = (pass) => {
    if (pass.length === 0) return "";
    if (pass.length < 6) return "Weak";
    if (pass.length < 10) return "Medium";
    return "Strong";
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email";
    
    if (formData.phone.length !== 10) newErrors.phone = "Enter 10 digit number";
    
    if (formData.password.length < 6) {
      newErrors.password = "Min 6 characters required";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true); // Button ko loading state mein daalein
      
      // Simulate API call
      setTimeout(() => {
        const { confirmPassword, ...dataToSave } = formData;
        localStorage.setItem("userCredentials", JSON.stringify(dataToSave));
        
        toast.success("Welcome to the League! redirecting...", {
          icon: '🚀',
          style: { borderRadius: '12px', background: '#1e293b', color: '#fff' }
        });

        setIsSubmitting(false);
        setTimeout(() => navigate("/login"), 2000);
      }, 1500);
    } else {
      toast.error("Please fill all details correctly");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      <Toaster position="top-center" />
      
      {/* Background Glows */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-green-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className={`relative z-10 w-full max-w-lg p-6 transition-all duration-1000 transform ${loaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
          
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
              Create <span className="text-green-500">Account</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2">Enter your details to join the squad</p>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            {/* Full Name */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
              <input name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500/50 transition-all" />
              {errors.fullName && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.fullName}</p>}
            </div>

            {/* Email & Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                  <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500/50 transition-all" />
               </div>
               <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                  <input name="phone" type="text" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500/50 transition-all" />
               </div>
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
              <input name="password" type={showPassword ? "text" : "password"} placeholder="Create Password" value={formData.password} onChange={handleChange} className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-green-500/50 transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              
              {/* Strength Meter Indicator */}
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                   <div className={`h-1 flex-1 rounded-full ${formData.password.length < 6 ? 'bg-red-500' : formData.password.length < 10 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                   <span className="text-[10px] text-gray-400 uppercase font-bold">{getPasswordStrength(formData.password)}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
              <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-slate-900/60 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500/50 transition-all" />
              {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.confirmPassword}</p>}
            </div>

            <button 
              disabled={isSubmitting}
              type="submit" 
              className={`w-full ${isSubmitting ? 'bg-gray-600' : 'bg-green-500 hover:bg-green-400'} text-black font-black text-lg py-4 rounded-2xl shadow-xl shadow-green-500/10 transition-all transform hover:scale-[1.01] active:scale-95 mt-4 uppercase flex items-center justify-center gap-2`}
            >
              {isSubmitting ? "Creating Squad..." : "Join Now"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm italic">
              Already a member? 
              <button onClick={() => navigate("/login")} className="text-yellow-400 font-bold ml-2 hover:underline">Log In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;