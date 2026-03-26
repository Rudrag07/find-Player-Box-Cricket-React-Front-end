import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Clock, Ticket, CreditCard, CheckCircle, MapPin, User, AlertCircle } from "lucide-react";

const Homen = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [hasJoinedAny, setHasJoinedAny] = useState(false);
  const [matches, setMatches] = useState([
    { id: "M101", location: "SG Highway Box (Adani Shantigram)", time: "06:00 PM", players: 9, total: 10, fee: 200, joined: false, timeLeft: null, isPaid: false },
    { id: "M202", location: "Sindhu Bhavan (SBR Arena)", time: "08:00 PM", players: 10, total: 10, fee: 250, joined: false, timeLeft: null, isPaid: false },
    { id: "M303", location: "South Bopal (The Turf)", time: "07:30 PM", players: 5, total: 10, fee: 180, joined: false, timeLeft: null, isPaid: false },
    { id: "M404", location: "Prahladnagar (Shott Box)", time: "09:00 PM", players: 9, total: 10, fee: 220, joined: false, timeLeft: null, isPaid: false },
    { id: "M505", location: "Science City (Decathlon Box)", time: "10:00 PM", players: 7, total: 10, fee: 200, joined: false, timeLeft: null, isPaid: false },
    { id: "M606", location: "Bodakdev (Urban Chowk Box)", time: "11:00 PM", players: 8, total: 10, fee: 250, joined: false, timeLeft: null, isPaid: false },
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

  const handleShare = (match) => {
    const message = `Hey! I'm playing Box Cricket at ${match.location} at ${match.time}. Join me?`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleJoin = (id) => {
    if (hasJoinedAny) {
      toast.error("You already have an active booking!");
      return;
    }
    setMatches(matches.map(m => m.id === id && m.players < m.total ? { ...m, players: m.players + 1, joined: true, timeLeft: 600 } : m));
    setHasJoinedAny(true);
    toast.success("Spot reserved! Waiting for squad to fill.");
  };

  const handleCancel = (id) => {
    setMatches(matches.map(m => m.id === id ? { ...m, players: m.players - 1, joined: false, timeLeft: null } : m));
    setHasJoinedAny(false);
    toast.error("Slot released.");
  };

  const openPayment = (match) => {
    // Check if squad is full
    if (match.players < 10) {
      toast.error(`Wait! ${10 - match.players} more players needed to unlock payment.`);
      return;
    }
    setSelectedMatch(match);
    setShowModal(true);
  };

  const processPayment = (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Verifying UPI Payment...");
    const bId = "BOX-" + Math.floor(1000 + Math.random() * 9000);
    setTimeout(() => {
      setMatches(matches.map(m => m.id === selectedMatch.id ? { ...m, isPaid: true, bookingId: bId } : m));
      setShowModal(false);
      setHasJoinedAny(false);
      toast.success(`Payment Successful: ${bId}`, { id: loadingToast });
      setActiveTab("my-matches");
    }, 2500);
  };

  const openTicket = (match) => {
    setViewingTicket(match);
    setShowReceipt(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const availableMatches = matches.filter(m => !m.isPaid);
  const paidMatches = matches.filter(m => m.isPaid);

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans text-slate-900">
      <Toaster position="top-center" />
      
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 py-4 px-6">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-green-600 tracking-widest uppercase text-left">Ahmedabad</span>
            <h1 className="text-xl font-black italic tracking-tighter text-slate-900">BOX<span className="text-green-600">CRICKET</span></h1>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-full">
            <button onClick={() => setActiveTab("home")} className={`px-4 py-2 rounded-full text-[10px] font-black transition-all ${activeTab === 'home' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500'}`}>HOME</button>
            <button onClick={() => setActiveTab("my-matches")} className={`px-4 py-2 rounded-full text-[10px] font-black transition-all ${activeTab === 'my-matches' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500'}`}>TICKETS</button>
          </div>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-5">
        <AnimatePresence mode="wait">
          {activeTab === "home" ? (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-left">
              <header className="flex justify-between items-center">
                <h2 className="text-2xl font-black italic text-slate-800">Available Matches 🏏</h2>
                <div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><span className="text-[10px] font-bold text-green-600 uppercase">LIVE</span></div>
              </header>

              {availableMatches.map((match) => (
                <div key={match.id} className={`bg-white rounded-[2rem] p-6 shadow-sm border ${match.joined ? 'border-green-500 ring-4 ring-green-50' : 'border-slate-100'} transition-all`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="max-w-[70%] text-left">
                      <h3 className="text-lg font-black text-slate-800 leading-tight">{match.location}</h3>
                      <div className="flex items-center gap-2 mt-2 text-slate-400 font-bold text-[10px]">
                        <Clock size={12}/> {match.time}
                      </div>
                    </div>
                    <p className="text-2xl font-black text-green-700">₹{match.fee}</p>
                  </div>

                  <div className="mb-6 bg-slate-50 p-3 rounded-2xl">
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2 text-slate-500">
                      <span>Squad: {match.players}/10</span>
                      {match.players < 10 && <span className="text-orange-500">Waiting for {10-match.players}</span>}
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div style={{ width: `${(match.players / 10) * 100}%` }} className={`h-full transition-all duration-500 ${match.players === 10 ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {!match.joined ? (
                      <div className="flex gap-3">
                        <button onClick={() => handleShare(match)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl text-[10px] uppercase flex items-center justify-center gap-2">
                          <Share2 size={16}/> Share
                        </button>
                        <button 
                          onClick={() => handleJoin(match.id)} 
                          disabled={match.players >= 10 || (hasJoinedAny && !match.joined)}
                          className={`flex-[2] font-black py-4 rounded-2xl text-[10px] uppercase transition-all ${match.players >= 10 || (hasJoinedAny && !match.joined) ? 'bg-slate-200 text-slate-400' : 'bg-green-600 text-white active:scale-95'}`}
                        >
                          Join Match
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-blue-50 py-2 rounded-xl text-center border border-blue-100 flex items-center justify-center gap-2">
                           <AlertCircle size={14} className="text-blue-600" />
                           <span className="text-blue-700 text-[10px] font-black uppercase">
                             {match.players < 10 ? `Need ${10-match.players} more to pay` : `Expires in ${formatTime(match.timeLeft)}`}
                           </span>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => handleCancel(match.id)} className="flex-1 bg-red-50 text-red-600 font-bold py-4 rounded-2xl text-[10px] uppercase border border-red-100">Cancel</button>
                          <button 
                            onClick={() => openPayment(match)} 
                            className={`flex-[2] font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest ${match.players < 10 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white animate-pulse'}`}
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
            <motion.div key="tickets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
              <h2 className="text-2xl font-black italic text-slate-800 mb-6 text-left">Confirmed Passes 🎟️</h2>
              {paidMatches.length === 0 ? <p className="text-center py-10 text-slate-400 uppercase text-xs font-bold">No tickets found</p> : (
                paidMatches.map((match) => (
                  <div key={match.id} className="bg-white rounded-[2rem] p-6 shadow-sm border-l-8 border-green-500">
                    <h3 className="text-lg font-black text-slate-800 italic leading-tight mb-4">{match.location}</h3>
                    <button onClick={() => openTicket(match)} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest">View Digital Pass</button>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* COMPACT DIGITAL RECEIPT */}
      <AnimatePresence>
        {showReceipt && viewingTicket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 z-[70]">
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-[320px] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                
                <div className="bg-green-600 p-6 text-center text-white relative">
                  <h3 className="font-black italic text-xl">BOXCRICKET</h3>
                  <p className="text-[8px] font-black opacity-70 uppercase tracking-widest mt-1">ENTRY PASS • {viewingTicket.bookingId}</p>
                </div>

                <div className="p-6 pt-8 space-y-4">
                  <div className="text-center">
                    <h4 className="text-base font-black text-slate-800 italic leading-tight uppercase">{viewingTicket.location}</h4>
                    <div className="flex items-center justify-center gap-3 mt-2 text-slate-500 font-bold text-[9px] uppercase">
                      <span className="flex items-center gap-1"><Clock size={10} className="text-green-600"/> {viewingTicket.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} className="text-slate-400"/> Ahmedabad</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Payment Summary</span>
                      <span className="bg-green-100 text-green-700 text-[8px] font-black px-2 py-0.5 rounded-full">PAID</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-800 italic mt-2">
                      <span>Mode</span>
                      <span className="text-slate-400">UPI (8200792488@axl)</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-800 italic mt-1">
                      <span>Amount Paid</span>
                      <span className="text-green-600">₹{viewingTicket.fee}.00</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-white rounded-2xl border-2 border-slate-50 shadow-inner mb-2">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${viewingTicket.bookingId}`} className="w-24 h-24" alt="Entry QR" />
                    </div>
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic mb-6">Scan for Ground Entry</p>
                    <button onClick={() => setShowReceipt(false)} className="w-full bg-slate-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95">Close Pass</button>
                  </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAYMENT MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full text-center">
              <h2 className="text-xl font-black italic mb-2">Scan & Pay ₹{selectedMatch?.fee}</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-6 tracking-widest">Squad Filled! Finalize Payment</p>
              <div className="bg-slate-50 p-4 rounded-3xl mb-6 inline-block border border-slate-100 shadow-inner">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=8200792488@axl&pn=BoxCricket&am=${selectedMatch?.fee}&cu=INR`} alt="QR" className="w-40 h-40" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-6 text-center">UPI ID: 8200792488@axl</p>
              <form onSubmit={processPayment} className="space-y-3">
                <button type="submit" className="w-full bg-green-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase shadow-lg active:scale-95 transition-all">I have paid successfully</button>
                <button type="button" onClick={() => setShowModal(false)} className="w-full text-slate-400 font-bold text-[9px] uppercase tracking-widest">Go Back</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Homen;