import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Search, MapPin, Clock, XCircle, Download, CheckCircle, AlertCircle, Share2, Phone, Star, Navigation } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const FindPlayer = () => {
  const [activeTab, setActiveTab] = useState("nearby");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [activeRequest, setActiveRequest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showPayment, setShowPayment] = useState(null);
  const [showReceipt, setShowReceipt] = useState(null);
  const [userRating, setUserRating] = useState(0); // For Rating feature

  const allGrounds = [
    { id: 1, ground: "Sindhu Bhavan Box", area: "SBR", fee: 200, time: "09:00 PM", captainName: "Rahul Sharma", contact: "8200792488", maps: "https://maps.google.com/?q=Sindhu+Bhavan+Road+Ahmedabad" },
    { id: 2, ground: "Decathlon Sports", area: "Applewoods", fee: 150, time: "10:30 PM", captainName: "Smit Patel", contact: "99887 76655", maps: "https://maps.google.com/?q=Decathlon+Applewoods+Ahmedabad" },
    { id: 3, ground: "The Arena Box", area: "Paldi", fee: 300, time: "08:00 PM", captainName: "Amit Shah", contact: "98250 12345", maps: "https://maps.google.com/?q=The+Arena+Paldi+Ahmedabad" },
    { id: 4, ground: "Urban Chowk", area: "Rajpath", fee: 180, time: "11:00 PM", captainName: "Karan Vyas", contact: "70411 99000", maps: "https://maps.google.com/?q=Urban+Chowk+Rajpath+Ahmedabad" },
    { id: 5, ground: "Sky High Box", area: "Paldi", fee: 250, time: "07:00 PM", captainName: "Meet Mehra", contact: "90123 45678", maps: "https://maps.google.com/?q=Sky+High+Paldi+Ahmedabad" },
    { id: 6, ground: "Gurukul Arena", area: "Gurukul", fee: 210, time: "09:00 PM", captainName: "Jignesh Mewani", contact: "98221 00998", maps: "https://maps.google.com/?q=Gurukul+Ahmedabad" },
    { id: 7, ground: "Satellite Box", area: "Satellite", fee: 230, time: "10:00 PM", captainName: "Parth Shah", contact: "88776 55443", maps: "https://maps.google.com/?q=Satellite+Ahmedabad" },
  ];

  const filteredGrounds = allGrounds.filter(g => 
    g.area.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.ground.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    let timer;
    if (activeRequest && activeRequest.status === 'pending' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && activeRequest?.status === 'pending') {
      setActiveRequest({ ...activeRequest, status: 'expired' });
      toast.error("Captain busy hai. Request expire ho gayi!");
    }
    return () => clearInterval(timer);
  }, [activeRequest, timeLeft]);

  const handleJoin = (match) => {
    if (activeRequest && (activeRequest.status === 'pending' || activeRequest.status === 'accepted')) {
      return toast.error("Pehle purani request khatam karo!");
    }
    setActiveRequest({ ...match, status: 'pending' });
    setTimeLeft(30);
    toast.success("Request Captain ko bhej di hai...");

    setTimeout(() => {
      if (Math.random() > 0.3) {
        setActiveRequest(prev => prev ? { ...prev, status: 'accepted' } : null);
        toast.success("Captain ne Haan bol diya! ✅");
      } else {
        setActiveRequest(prev => prev ? { ...prev, status: 'rejected' } : null);
        toast.error("Captain ne Na bol diya. ❌");
      }
    }, 4000);
  };

  const downloadDirectPDF = async () => {
    const element = document.getElementById("ticket-pdf");
    const loading = toast.loading("Ticket ban rahi hai...");
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, 150);
      pdf.save(`BoxTicket_${showReceipt.ground}.pdf`);
      toast.dismiss(loading);
      toast.success("Download Complete!");
    } catch (err) {
      toast.dismiss(loading);
      toast.error("PDF download fail ho gaya!");
    }
  };

  const shareToWhatsApp = () => {
    const msg = `*CRICKET BOOKING CONFIRMED!* 🏏%0A%0A*Venue:* ${showReceipt.ground}%0A*Area:* ${showReceipt.area}%0A*Time:* ${showReceipt.time}%0A*Captain:* ${showReceipt.captainName}%0A%0A_Chalo ground pe milte hain!_`;
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const callCaptain = () => {
    window.location.href = `tel:${showReceipt.contact}`;
  };

  const openInMaps = () => {
    window.open(showReceipt.maps, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Toaster position="top-center" />
      
      {/* HEADER */}
      <div className="bg-white p-6 shadow-md sticky top-0 z-50 rounded-b-[2.5rem]">
        <h1 className="text-xl font-black italic uppercase mb-4 tracking-tight text-green-600 text-center">Ahmedabad Box Discovery</h1>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search Area (Paldi, Gurukul, SBR...)" 
            className="w-full bg-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none border-2 border-transparent focus:border-green-500 shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-slate-400" size={18} />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* MATCH LIST */}
        <div className="space-y-4">
          {filteredGrounds.length > 0 ? (
            filteredGrounds.map(match => (
              <div key={match.id} className="bg-white p-6 rounded-[2rem] border shadow-sm hover:border-green-300 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-black text-sm uppercase italic text-slate-800">{match.ground}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{match.area}</p>
                    </div>
                    <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg italic">₹{match.fee}</span>
                </div>
                <button 
                  onClick={() => handleJoin(match)}
                  className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest ${activeRequest?.id === match.id ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white active:scale-95'}`}
                >
                  {activeRequest?.id === match.id ? `Waiting... (${timeLeft}s)` : "Join This Match"}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <AlertCircle className="mx-auto text-slate-300 mb-2" size={40} />
              <p className="text-slate-400 font-black italic uppercase text-xs">No Box Cricket Found</p>
            </div>
          )}
        </div>
      </div>

     {/* PAYMENT MODAL - AUTO-AMOUNT FIXED */}
{showPayment && (
  <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-end">
    <div className="w-full bg-white rounded-t-[3.5rem] p-10 animate-in slide-in-from-bottom duration-300 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
      <h2 className="text-center font-black uppercase italic text-lg mb-8 text-slate-900">Scan QR to Pay</h2>
      
      <div className="flex flex-col items-center mb-8 bg-slate-50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200">
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-4">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              `upi://pay?pa=8200792488@axl&pn=${showPayment.captainName}&am=${showPayment.fee.toString().replace(/[^0-9]/g, '')}&cu=INR`
            )}`} 
            className="w-40 h-40" 
            alt="Payment QR"
          />
        </div>
        <p className="text-3xl font-black tracking-tighter text-slate-900 italic">₹{showPayment.fee}</p>
        <div className="mt-2 flex items-center gap-1 text-green-600">
          <CheckCircle size={12} />
          <p className="text-[10px] font-black uppercase italic">Amount Auto-filled</p>
        </div>
        <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 tracking-widest">To: {showPayment.captainName}</p>
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => {setShowPayment(null); setShowReceipt(showPayment);}} 
          className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black text-[11px] uppercase shadow-xl shadow-green-100 active:scale-95 transition-all"
        >
          Confirm Payment
        </button>
        <button 
          onClick={() => setShowPayment(null)} 
          className="w-full text-slate-400 font-black text-[9px] uppercase tracking-widest py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      {/* FINAL RECEIPT MODAL */}
      {showReceipt && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-start pt-10 pb-10 px-6 overflow-y-auto">
            <div className="w-full max-w-sm flex flex-col items-center">
                
                {/* Ticket Component */}
                <div id="ticket-pdf" className="bg-white p-6 sm:p-8 rounded-[2rem] border-[6px] border-green-600 w-full shadow-2xl mb-6">
                    <div className="flex justify-center mb-3 text-green-600"><CheckCircle size={32} /></div>
                    <h1 className="text-xl font-black italic text-center mb-5 uppercase tracking-tight">CONFIRMED TICKET</h1>
                    
                    <div className="space-y-2.5 text-[10px] font-black uppercase mb-5 text-slate-700 border-b pb-4">
                        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400 italic">Ground</span><span>{showReceipt.ground}</span></div>
                        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400 italic">Timing</span><span>{showReceipt.time}</span></div>
                        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400 italic">Area</span><span>{showReceipt.area}</span></div>
                    </div>

                    {/* Ground Rules Feature */}
                    <div className="mb-5">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Ground Rules:</p>
                      <ul className="text-[9px] font-bold text-slate-600 space-y-1 italic">
                        <li>• Only sports shoes allowed</li>
                        <li>• Reporting time: 15 mins before</li>
                        <li>• 12 Players max in the box</li>
                      </ul>
                    </div>
                        
                    <div className="bg-slate-900 text-white p-5 rounded-[1.5rem] shadow-lg">
                        <p className="text-[7px] opacity-40 mb-1 tracking-[0.2em] uppercase font-bold text-center">Captain Details</p>
                        <p className="text-sm italic text-center border-b border-white/10 pb-2 mb-2">{showReceipt.captainName}</p>
                        <p className="font-mono text-green-400 text-center text-lg leading-none">{showReceipt.contact}</p>
                    </div>

                    {/* Rating Feature inside Ticket */}
                    <div className="mt-6 pt-4 border-t flex flex-col items-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-tighter text-center">How was your booking experience?</p>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(star => (
                            <Star 
                              key={star} 
                              size={16} 
                              onClick={() => setUserRating(star)}
                              className={`cursor-pointer transition-all ${userRating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="w-full flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={downloadDirectPDF} className="bg-white text-slate-900 py-4 rounded-[1.5rem] font-black text-[9px] uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                          <Download size={16} /> Ticket
                      </button>
                      <button onClick={openInMaps} className="bg-white text-blue-600 py-4 rounded-[1.5rem] font-black text-[9px] uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                          <Navigation size={16} /> Open Maps
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={shareToWhatsApp} className="bg-[#25D366] text-white py-4 rounded-[1.5rem] font-black text-[9px] uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                            <Share2 size={16} /> WhatsApp
                        </button>
                        <button onClick={callCaptain} className="bg-blue-600 text-white py-4 rounded-[1.5rem] font-black text-[9px] uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                            <Phone size={16} /> Call Now
                        </button>
                    </div>
                    <button onClick={() => {setShowReceipt(null); setActiveRequest(null); setUserRating(0);}} className="text-[10px] font-black text-white/60 uppercase mt-4 tracking-widest text-center py-2">Close & Back</button>
                </div>
                
            </div>
        </div>
      )}

      {/* FLOATING STATUS BAR */}
      {activeRequest && !showReceipt && !showPayment && (
          <div className="fixed bottom-6 left-4 right-4 bg-white shadow-2xl border-2 border-green-500 p-4 rounded-3xl flex justify-between items-center z-[500] animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase italic text-slate-900">{activeRequest.ground}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{activeRequest.status}</span>
                </div>
              </div>
              {activeRequest.status === 'accepted' ? (
                <button onClick={() => setShowPayment(activeRequest)} className="bg-green-600 text-white px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase shadow-lg shadow-green-200 active:scale-95 transition-all">Pay Now</button>
              ) : (activeRequest.status === 'rejected' || activeRequest.status === 'expired') ? (
                <button onClick={() => setActiveRequest(null)} className="bg-red-500 text-white px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase active:scale-95 transition-all">Clear</button>
              ) : null}
          </div>
      )}
    </div>
  );
};

export default FindPlayer;