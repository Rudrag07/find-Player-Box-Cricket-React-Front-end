import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const Homen = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [matches, setMatches] = useState([
    { id: "M101", location: "SG Highway Box (Adani Shantigram)", time: "06:00 PM", players: 9, total: 10, fee: 200, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz1", isPaid: false, bookingId: null },
    { id: "M202", location: "Sindhu Bhavan (SBR Arena)", time: "08:00 PM", players: 10, total: 10, fee: 250, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz2", isPaid: false, bookingId: null },
    { id: "M303", location: "South Bopal (The Turf)", time: "07:30 PM", players: 5, total: 10, fee: 180, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz3", isPaid: false, bookingId: null },
    { id: "M404", location: "Prahladnagar (Shott Box)", time: "09:00 PM", players: 9, total: 10, fee: 220, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz4", isPaid: false, bookingId: null },
    { id: "M505", location: "Science City (Decathlon Box)", time: "10:00 PM", players: 7, total: 10, fee: 200, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz5", isPaid: false, bookingId: null },
    { id: "M606", location: "Bodakdev (Urban Chowk Box)", time: "11:00 PM", players: 8, total: 10, fee: 250, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz6", isPaid: false, bookingId: null },
    { id: "M707", location: "Satellite (Jodhpur Box)", time: "05:00 PM", players: 4, total: 10, fee: 150, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz7", isPaid: false, bookingId: null },
    { id: "M808", location: "Vastrapur (Lake View Arena)", time: "07:00 PM", players: 9, total: 10, fee: 300, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz8", isPaid: false, bookingId: null },
    { id: "M909", location: "Gota (Silver Box)", time: "08:30 PM", players: 6, total: 10, fee: 200, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz9", isPaid: false, bookingId: null },
    { id: "M110", location: "Naranpura (Sports Club Box)", time: "09:30 PM", players: 2, total: 10, fee: 180, joined: false, timeLeft: null, mapUrl: "https://goo.gl/maps/xyz10", isPaid: false, bookingId: null },
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

  const shareToWhatsApp = (match) => {
    const currentUrl = window.location.origin + "/join/" + match.id;
    const message = `Chalo khelne! 🏏%0A📍 *${match.location}*%0A🕒 Time: ${match.time}%0A💰 Fee: ₹${match.fee}%0AJoin link: ${currentUrl}`;
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleJoin = (id) => {
    setMatches(matches.map(m => m.id === id && m.players < m.total ? { ...m, players: m.players + 1, joined: true, timeLeft: 600 } : m));
    toast.success("Joined! 10 mins window started.");
  };

  const handleCancel = (id) => {
    setMatches(matches.map(m => m.id === id ? { ...m, players: m.players - 1, joined: false, timeLeft: null } : m));
    toast.error("Booking Cancelled.");
  };

  const openPayment = (match) => {
    setSelectedMatch(match);
    setShowModal(true);
  };

  const openTicket = (match) => {
    setViewingTicket(match);
    setShowReceipt(true);
  };

  const processPayment = (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Processing Payment...");
    const bId = "BOX-" + Math.floor(1000 + Math.random() * 9000);
    setTimeout(() => {
      setMatches(matches.map(m => m.id === selectedMatch.id ? { ...m, isPaid: true, bookingId: bId } : m));
      setShowModal(false);
      toast.success(`Payment Successful! Ticket ID: ${bId}`, { id: loadingToast });
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
    <div className="min-h-screen bg-gray-50 pb-10 font-sans text-slate-800">
      <Toaster position="top-center" />
      
      <nav className="bg-green-700 text-white p-4 sticky top-0 z-50 shadow-xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold italic underline">🏏 BOXCRICKET.IO</h1>
          <div className="flex gap-4 text-xs font-bold uppercase">
            <button onClick={() => setActiveTab("home")} className={activeTab === 'home' ? 'border-b-2 border-white pb-1' : 'opacity-70'}>Home</button>
            <button onClick={() => setActiveTab("my-matches")} className={activeTab === 'my-matches' ? 'border-b-2 border-white pb-1' : 'opacity-70'}>My Matches ({paidMatches.length})</button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4 mt-4">
        {activeTab === "home" ? (
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tight">Box Cricket Ahmedabad</h2>
            {availableMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <h3 className="text-lg font-black leading-tight">{match.location}</h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase mt-1">{match.time}</p>
                  </div>
                  <span className="text-green-700 font-black text-xl">₹{match.fee}</span>
                </div>

                <div className="my-4">
                  <div className="flex justify-between text-[10px] font-bold mb-1 italic text-gray-400">
                    <span>Squad Status</span>
                    <span>{match.players}/10 Players</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-700 ${match.players >= 10 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${(match.players / 10) * 100}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {!match.joined ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => shareToWhatsApp(match)} className="bg-slate-900 text-white text-[11px] font-black py-3 rounded-xl uppercase">Share</button>
                      <button onClick={() => handleJoin(match.id)} disabled={match.players >= 10} className={`text-[11px] font-black py-3 rounded-xl uppercase ${match.players >= 10 ? 'bg-gray-100 text-gray-400' : 'bg-green-600 text-white'}`}>{match.players >= 10 ? 'Full' : 'Join'}</button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-blue-50 py-1 rounded-lg text-center text-blue-700 text-[10px] font-bold uppercase">Cancel in: {formatTime(match.timeLeft)}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleCancel(match.id)} className="bg-red-50 text-red-600 text-[11px] font-black py-3 rounded-xl uppercase">Cancel</button>
                        <button onClick={() => openPayment(match)} disabled={match.players < 10} className={`text-[11px] font-black py-3 rounded-xl uppercase ${match.players >= 10 ? 'bg-green-600 text-white animate-pulse' : 'bg-gray-200 text-gray-400'}`}>Pay Now</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase">Your Booked Matches</h2>
            {paidMatches.length === 0 && <p className="text-center text-gray-400 py-10 font-bold bg-white rounded-2xl border-2 border-dashed">No tickets booked.</p>}
            {paidMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-green-500 relative">
                <p className="text-green-600 text-[10px] font-black uppercase mb-1">ID: {match.bookingId}</p>
                <h3 className="text-lg font-black">{match.location}</h3>
                <p className="text-gray-400 font-bold text-[10px] mb-4 uppercase">{match.time}</p>
                <button onClick={() => openTicket(match)} className="w-full bg-slate-900 text-white text-[11px] font-black py-3 rounded-xl uppercase tracking-widest">View Ticket</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- PAYMENT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-6 max-w-xs w-full shadow-2xl">
            <h2 className="text-xl font-black mb-1">Final Step</h2>
            <p className="text-gray-400 text-xs mb-4 uppercase">Booking for {selectedMatch?.location}</p>
            <form onSubmit={processPayment} className="space-y-4">
              <div className="bg-green-50 p-4 rounded-2xl text-center border">
                <p className="text-4xl font-black text-green-700">₹{selectedMatch?.fee}</p>
              </div>
              <input type="text" placeholder="UPI ID" required className="w-full p-4 bg-gray-50 border rounded-xl outline-none text-xs font-bold" />
              <button type="submit" className="w-full bg-green-600 text-white font-black py-4 rounded-xl shadow-lg uppercase text-xs">Confirm Payment</button>
              <button type="button" onClick={() => setShowModal(false)} className="w-full py-2 text-gray-400 font-bold text-[10px] uppercase">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* --- RECEIPT MODAL --- */}
      {showReceipt && viewingTicket && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[70] backdrop-blur-md">
          <div className="bg-white w-full max-w-xs rounded-[30px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="bg-green-600 p-6 text-center text-white shrink-0 relative">
              <h2 className="text-lg font-black uppercase tracking-[3px]">Receipt</h2>
              <p className="text-[9px] font-bold opacity-80 uppercase">ID: {viewingTicket.bookingId}</p>
              <div className="absolute -bottom-3 left-0 right-0 flex justify-around">
                {[...Array(10)].map((_, i) => <div key={i} className="w-5 h-5 bg-white rounded-full"></div>)}
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 pt-8">
              <div className="flex justify-between items-center border-b border-dashed pb-2 text-[10px]">
                <span className="text-gray-400 font-bold uppercase">Venue</span>
                <span className="font-black text-slate-800">{viewingTicket.location}</span>
              </div>
              <div className="flex justify-between items-center border-b border-dashed pb-2 text-[10px]">
                <span className="text-gray-400 font-bold uppercase">Time</span>
                <span className="font-black text-slate-800">{viewingTicket.time}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border flex justify-between items-center">
                <span className="text-[9px] font-black text-gray-400 uppercase">Paid</span>
                <span className="text-lg font-black text-slate-900">₹{viewingTicket.fee}</span>
              </div>

              <div className="flex flex-col items-center py-2">
                <div className="bg-white p-3 rounded-2xl border-2 mb-2">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`BOX-CRICKET-AHMEDABAD\nID: ${viewingTicket.bookingId}\nVenue: ${viewingTicket.location}\nStatus: PAID ✅`)}&margin=10`} 
                    alt="QR" 
                    className="w-24 h-24" 
                  />
                </div>
                <p className="text-[9px] text-gray-400 font-black uppercase">Scan at Ground</p>
              </div>
            </div>

            <div className="p-5 bg-gray-50 border-t flex flex-col gap-2 shrink-0">
              <button onClick={() => window.print()} className="w-full bg-white border-2 py-3 rounded-xl font-black text-[10px] uppercase">Print</button>
              <button onClick={() => setShowReceipt(false)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase shadow-lg">← Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homen;