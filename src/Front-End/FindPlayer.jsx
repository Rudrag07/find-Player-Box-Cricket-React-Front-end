import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const FindPlayer = () => {
  const [activeTab, setActiveTab] = useState("nearby");
  const [myRequests, setMyRequests] = useState([]);
  const [showPayment, setShowPayment] = useState(null);
  const [showReceipt, setShowReceipt] = useState(null);

  const liveMatches = [
    { id: 1, ground: "Sindhu Bhavan Box", area: "SBR", fee: 200, time: "09:00 PM", captainName: "Rahul Sharma", contact: "8200792488" },
    { id: 2, ground: "Decathlon Sports", area: "Applewoods", fee: 150, time: "10:30 PM", captainName: "Smit Patel", contact: "99887 76655" },
  ];

  const handleJoin = (match) => {
    setMyRequests([...myRequests, { ...match, status: 'pending' }]);
    toast.success("Request sent!");
    setTimeout(() => {
      setMyRequests(prev => prev.map(r => r.id === match.id ? { ...r, status: 'accepted' } : r));
      toast.success("Captain Accepted! ✅");
    }, 3000);
  };

  // --- SIMPLE DIRECT DOWNLOAD ---
  const handleDownload = () => {
    window.print(); // Ye sabse best aur direct tarika hai bina code bada kiye
    setShowReceipt(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <Toaster position="top-center" />
      
      {/* HEADER */}
      <div className="bg-white p-6 border-b sticky top-0 z-[1000]">
        <h1 className="text-2xl font-black italic uppercase italic">Match Discovery</h1>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* TABS */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab("nearby")} className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase ${activeTab === 'nearby' ? 'bg-green-600 text-white' : 'bg-white text-slate-400'}`}>Nearby Games</button>
          <button onClick={() => setActiveTab("requests")} className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase ${activeTab === 'requests' ? 'bg-green-600 text-white' : 'bg-white text-slate-400'}`}>My Requests</button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {activeTab === "nearby" ? (
            liveMatches.map(match => (
              <div key={match.id} className="bg-white p-5 rounded-[2rem] border shadow-sm">
                <h3 className="font-black text-sm uppercase italic">{match.ground}</h3>
                <button onClick={() => handleJoin(match)} className="w-full mt-3 py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase">Join Match</button>
              </div>
            ))
          ) : (
            myRequests.map(req => (
              <div key={req.id} className="bg-white p-5 rounded-[2rem] border shadow-sm">
                <div className="flex justify-between mb-4 font-black text-xs italic uppercase">{req.ground} <span className="text-green-500 underline">{req.status}</span></div>
                {req.status === 'accepted' && (
                  <button onClick={() => setShowPayment(req)} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase">Pay & Get Receipt</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 z-[5000] bg-black/70 flex items-end">
          <div className="w-full bg-white rounded-t-[3rem] p-8">
            <h2 className="text-center font-black uppercase italic mb-6">UPI Payment</h2>
            <div className="flex flex-col items-center mb-6">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=8200792488@axl&am=${showPayment.fee}`} className="w-32 h-32 mb-2" />
              <p className="font-black">₹{showPayment.fee}</p>
              <p className="text-[10px] text-slate-400 uppercase">To: {showPayment.captainName}</p>
            </div>
            <button onClick={() => {setShowPayment(null); setShowReceipt(showPayment);}} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase">Confirm Payment</button>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL (This is what downloads as PDF) */}
      {showReceipt && (
        <div className="fixed inset-0 z-[6000] bg-white flex flex-col items-center justify-center p-10">
            <div className="border-4 border-green-600 p-8 rounded-3xl w-full max-w-sm text-center">
                <h1 className="text-2xl font-black italic mb-2">MATCH TICKET</h1>
                <p className="text-[10px] uppercase mb-6 border-b pb-4">Official Booking</p>
                <div className="space-y-2 text-left mb-6 font-bold uppercase text-xs">
                    <div className="flex justify-between text-slate-400">Ground: <span className="text-black">{showReceipt.ground}</span></div>
                    <div className="flex justify-between text-slate-400">Time: <span className="text-black">{showReceipt.time}</span></div>
                </div>
                <div className="bg-slate-900 text-white p-4 rounded-xl mb-6">
                    <p className="text-[8px] uppercase opacity-50">Captain Details</p>
                    <p className="text-sm">{showReceipt.captainName}</p>
                    <p className="text-xs font-mono text-green-400">{showReceipt.contact}</p>
                </div>
                <button onClick={handleDownload} className="w-full bg-green-600 text-white py-4 rounded-xl font-black text-[10px] uppercase no-print">Download PDF</button>
                <button onClick={() => setShowReceipt(null)} className="mt-4 text-[10px] font-bold text-slate-400 uppercase no-print">Back</button>
            </div>
            
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .no-print { display: none !important; }
                    #receipt-content, #receipt-content * { visibility: visible; }
                    #receipt-content { position: absolute; left: 0; top: 0; width: 100%; }
                }
            `}</style>
        </div>
      )}
    </div>
  );
};

export default FindPlayer;