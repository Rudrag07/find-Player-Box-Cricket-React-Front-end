import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, MapPin, Clock, Ticket, CheckCircle, XCircle, CreditCard, Home as HomeIcon } from "lucide-react";

const Homen = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [matches, setMatches] = useState([
    { id: "M101", location: "SG Highway Box (Adani Shantigram)", time: "06:00 PM", players: 9, total: 10, fee: 200, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz1", isPaid: false, bookingId: null },
    { id: "M202", location: "Sindhu Bhavan (SBR Arena)", time: "08:00 PM", players: 10, total: 10, fee: 250, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz2", isPaid: false, bookingId: null },
    { id: "M303", location: "South Bopal (The Turf)", time: "07:30 PM", players: 5, total: 10, fee: 180, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz3", isPaid: false, bookingId: null },
    { id: "M404", location: "Prahladnagar (Shott Box)", time: "09:00 PM", players: 9, total: 10, fee: 220, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz4", isPaid: false, bookingId: null },
    { id: "M505", location: "Science City (Decathlon Box)", time: "10:00 PM", players: 7, total: 10, fee: 200, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz5", isPaid: false, bookingId: null },
    { id: "M606", location: "Bodakdev (Urban Chowk Box)", time: "11:00 PM", players: 8, total: 10, fee: 250, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz6", isPaid: false, bookingId: null },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [viewingTicket, setViewingTicket] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setMatches(prev => prev.map(m => (m.joined && m.timeLeft > 0 ? { ...m, timeLeft: m.timeLeft - 1 } : m)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleJoin = (id) => {
    setMatches(matches.map(m => m.id === id && m.players < m.total ? { ...m, players: m.players + 1, joined: true, timeLeft: 600 } : m));
    toast.success("Spot reserved for 10 mins!");
  };

  const handleCancel = (id) => {
    setMatches(matches.map(m => m.id === id ? { ...m, players: m.players - 1, joined: false, timeLeft: null } : m));
    toast.error("Slot released.");
  };

  const processPayment = (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Confirming Payment...");
    const bId = "BOX-" + Math.floor(1000 + Math.random() * 9000);
    setTimeout(() => {
      setMatches(matches.map(m => m.id === selectedMatch.id ? { ...m, isPaid: true, bookingId: bId } : m));
      setShowModal(false);
      toast.success(`Booking Confirmed: ${bId}`, { id: loadingToast });
      setActiveTab("my-matches");
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const availableMatches = matches.filter(m => !m.isPaid);
  const paidMatches = matches.filter(m => m.isPaid);

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Dynamic Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 py-4 px-6">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-green-600 tracking-widest uppercase">Ahmedabad</span>
            <h1 className="text-xl font-black italic tracking-tighter text-slate-900">BOX<span className="text-green-600">CRICKET</span></h1>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-full">
            <button onClick={() => setActiveTab("home")} className={`px-4 py-2 rounded-full text-xs font-black transition-all ${activeTab === 'home' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500'}`}>HOME</button>
            <button onClick={() => setActiveTab("my-matches")} className={`px-4 py-2 rounded-full text-xs font-black transition-all ${activeTab === 'my-matches' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500'}`}>TICKETS</button>
          </div>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-5">
        <AnimatePresence mode="wait">
          {activeTab === "home" ? (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
              <header className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-black italic text-slate-800">Available Matches 🏏</h2>
                <div className="animate-pulse flex items-center gap-1">
                   <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                   <span className="text-[10px] font-bold text-green-600">LIVE</span>
                </div>
              </header>

              {availableMatches.map((match) => (
                <div key={match.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-green-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="max-w-[70%]">
                      <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-green-600 transition-colors">{match.location}</h3>
                      <div className="flex items-center gap-2 mt-2 text-slate-400">
                        <Clock size={12}/>
                        <span className="text-[10px] font-bold uppercase">{match.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-700">₹{match.fee}</p>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Per Person</span>
                    </div>
                  </div>

                  {/* Slot Bar */}
                  <div className="mb-6 bg-slate-50 p-3 rounded-2xl">
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-wide text-slate-500">
                      <span>Squad Fill</span>
                      <span>{match.players}/10 Filled</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${(match.players / 10) * 100}%` }} 
                        className={`h-full ${match.players >= 10 ? 'bg-red-500' : 'bg-gradient-to-r from-green-400 to-green-600'}`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-1 gap-3">
                    {!match.joined ? (
                      <div className="flex gap-3">
                        <button onClick={() => toast("Link Copied! Share on WhatsApp")} className="flex-1 bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl text-xs uppercase flex items-center justify-center gap-2">
                          <Share2 size={16}/> Share
                        </button>
                        <button 
                          onClick={() => handleJoin(match.id)} 
                          disabled={match.players >= 10}
                          className={`flex-[2] font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all ${match.players >= 10 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-100'}`}
                        >
                          {match.players >= 10 ? 'Squad Full' : 'Join Match'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-yellow-50 py-2 rounded-xl text-center border border-yellow-100 flex items-center justify-center gap-2">
                           <Clock size={14} className="text-yellow-600 animate-spin" />
                           <span className="text-yellow-700 text-[11px] font-black">PAYMENT CLOSES IN: {formatTime(match.timeLeft)}</span>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => handleCancel(match.id)} className="flex-1 bg-red-50 text-red-600 font-bold py-4 rounded-2xl text-xs uppercase border border-red-100">Cancel</button>
                          <button 
                            onClick={() => openPayment(match)} 
                            disabled={match.players < 10 && false}
                            className="flex-[2] bg-slate-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest animate-pulse"
                          >
                            Pay Securely
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
              <h2 className="text-2xl font-black italic text-slate-800 mb-6">Confirmed Passes 🎟️</h2>
              {paidMatches.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] py-16 px-6 text-center border-2 border-dashed border-slate-200">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ticket className="text-slate-300" size={40} />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active tickets</p>
                  <button onClick={() => setActiveTab("home")} className="mt-4 text-green-600 font-black text-sm uppercase underline">Book a Match</button>
                </div>
              ) : (
                paidMatches.map((match) => (
                  <div key={match.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border-l-[8px] border-green-500 relative overflow-hidden flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">PAID ✅</span>
                      <p className="text-slate-300 text-[10px] font-bold uppercase">ID: {match.bookingId}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 italic leading-tight pr-12">{match.location}</h3>
                      <p className="text-slate-400 font-bold text-[10px] mt-1 uppercase tracking-widest">{match.time}</p>
                    </div>
                    <button onClick={() => openTicket(match)} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-green-600 transition-colors">View Digital Pass</button>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- PAYMENT MODAL (Modern) --- */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="bg-white rounded-t-[3rem] sm:rounded-[3rem] p-8 max-w-sm w-full shadow-2xl relative">
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden"></div>
              <h2 className="text-2xl font-black italic mb-2">Final Checkout</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase mb-8">Secure Booking for {selectedMatch?.location}</p>
              
              <form onSubmit={processPayment} className="space-y-6">
                <div className="bg-green-50 p-6 rounded-[2rem] border-2 border-green-100 border-dashed text-center">
                  <p className="text-xs text-green-600 font-bold uppercase mb-1 tracking-wider">Amount to Pay</p>
                  <p className="text-5xl font-black text-green-700">₹{selectedMatch?.fee}</p>
                </div>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="UPI ID (e.g., player@upi)" required className="w-full p-5 pl-12 bg-slate-50 border-none rounded-2xl outline-none text-xs font-black shadow-inner" />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-200 text-xs uppercase tracking-[0.2em]">Confirm Booking</button>
                <button type="button" onClick={() => setShowModal(false)} className="w-full text-slate-400 font-bold text-[10px] uppercase pt-2 tracking-widest">Back to Matches</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- RECEIPT MODAL (Ticket Design) --- */}
      <AnimatePresence>
        {showReceipt && viewingTicket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 z-[70]">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-xs rounded-[3rem] overflow-hidden shadow-2xl flex flex-col relative">
              <div className="bg-green-600 p-10 text-center text-white relative">
                <h2 className="text-2xl font-black italic uppercase tracking-widest">MATCH PASS</h2>
                <p className="text-[10px] font-black opacity-80 mt-2">ID: {viewingTicket.bookingId}</p>
                {/* Decorative Circles */}
                <div className="absolute -bottom-4 left-0 right-0 flex justify-between px-2">
                   {[...Array(8)].map((_, i) => <div key={i} className="w-8 h-8 bg-white rounded-full"></div>)}
                </div>
              </div>

              <div className="p-8 pt-12 text-center">
                <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4 mb-6 border border-slate-100">
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Arena</p>
                    <p className="font-black text-slate-800 text-sm leading-tight italic">{viewingTicket.location}</p>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3">
                    <div className="text-left">
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Reporting</p>
                      <p className="font-black text-slate-800 text-xs italic">{viewingTicket.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Price</p>
                      <p className="font-black text-green-600 text-xs italic">PAID</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-3xl border-4 border-slate-50 mb-6 mx-auto w-fit shadow-inner">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`ID: ${viewingTicket.bookingId}\nGround: ${viewingTicket.location}`)}`} 
                    alt="QR Code" 
                    className="w-32 h-32" 
                  />
                </div>

                <button onClick={() => setShowReceipt(false)} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95">
                  ← Back to App
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Homen;