import React, { useState, useRef, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

const MatchDetails = () => {
  const [showPayModal, setShowPayModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const receiptRef = useRef(null);

  const [matchData, setMatchData] = useState({
    name: "Loading...",
    location: "Ahmedabad",
    price: "1,800",
    date: "25th Oct",
    time: "09:00 PM",
    upiId: "boxcricket@upi"
  });

  useEffect(() => {
    const savedData = localStorage.getItem('currentMatchDetails');
    if (savedData) {
      const data = JSON.parse(savedData);
      setMatchData({
        name: data.name || "Arena Name",
        location: data.location || "Ahmedabad",
        price: data.price || "1,800",
        date: data.date || "25th Oct",
        time: data.time || "09:00 PM",
        upiId: "paytm@upi" 
      });
    }
  }, []);

  const downloadReceipt = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element, { scale: 3, backgroundColor: '#ffffff', useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 15, 30, 180, 95);
    pdf.save(`${matchData.name}_Receipt.pdf`);
    toast.success("Receipt Downloaded!");
  };

  const handlePayment = (e) => {
    e.preventDefault();
    const upiInput = e.target.upi_field.value.trim();
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

    if (!upiRegex.test(upiInput)) {
      // --- ENGLISH ERROR MESSAGE ---
      toast.error("Please enter a valid UPI ID (e.g., name@bank)");
      return;
    }

    toast.loading("Processing Payment...");
    
    setTimeout(() => {
      setIsPaid(true);
      setShowPayModal(false);
      toast.dismiss();
      toast.success(`Payment to ${matchData.name} Successful! 🏏`);

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#ffffff', '#000000']
      });

    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-left">
      <Toaster position="top-center" />
      
      <div className="relative h-72 w-full overflow-hidden shadow-2xl">
        <img src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="header" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-[3.5rem] shadow-2xl p-8 md:p-12 border border-white text-left">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 inline-block ${isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {isPaid ? "Confirmed" : "Payment Pending"}
              </span>
              <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">
                {matchData.name}
              </h1>
              <p className="text-gray-400 font-bold mt-2 italic text-sm">📍 {matchData.location}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border text-center min-w-[150px]">
              <p className="text-[10px] font-black text-gray-400 uppercase">Amount</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{matchData.price}</p>
            </div>
          </div>

          <hr className="border-slate-100 mb-10" />

          <div ref={receiptRef} className={`rounded-[2.5rem] p-10 relative overflow-hidden transition-all duration-700 border-2 ${isPaid ? 'bg-white border-green-500 shadow-xl' : 'bg-white border-slate-200'}`}>
             {isPaid && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.08] -rotate-12 pointer-events-none text-9xl font-black text-green-600">PAID</div>
             )}
             <div className="relative z-10">
               <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-6">
                  <h4 className="text-[13px] font-black uppercase tracking-[0.3em] text-slate-400">Official Receipt</h4>
                  <p className="text-[11px] text-slate-900 font-mono font-black bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">{isPaid ? "#CONF-9923" : "PENDING"}</p>
               </div>
               <div className="grid grid-cols-2 gap-10 text-left">
                  <div className="space-y-8">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-2">Venue</p>
                      <p className="text-2xl font-black text-slate-900 italic uppercase leading-none">{matchData.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-2">Timing</p>
                      <p className="text-lg font-black text-slate-800 uppercase tracking-tighter">{matchData.date} • {matchData.time}</p>
                    </div>
                  </div>
                  <div className="space-y-8 text-right flex flex-col items-end">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-2">Total Amount</p>
                      <p className="text-4xl font-black text-slate-900">₹{matchData.price}</p>
                    </div>
                    <div className={`p-3 bg-white rounded-2xl shadow-lg border-2 ${isPaid ? 'border-green-500' : 'grayscale opacity-30'}`}>
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${matchData.upiId}&pn=${matchData.name.replace(/\s/g, '%20')}&am=${matchData.price}&cu=INR`} alt="QR" className="w-20 h-20" />
                    </div>
                  </div>
               </div>
             </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isPaid ? (
               <button onClick={() => setShowPayModal(true)} className="md:col-span-2 bg-green-600 text-white font-black py-5 rounded-[2rem] text-sm uppercase shadow-xl active:scale-95 hover:bg-green-700 transition-colors">Pay ₹{matchData.price} Now</button>
            ) : (
              <>
                <a href={`http://googleusercontent.com/maps?q=${encodeURIComponent(matchData.name + " " + matchData.location)}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-black font-black py-5 rounded-3xl flex items-center justify-center gap-3 text-xs uppercase shadow-xl hover:bg-green-400">Get Directions 📍</a>
                <button onClick={downloadReceipt} className="bg-slate-100 text-slate-900 font-black py-5 rounded-3xl text-xs uppercase shadow-md hover:bg-slate-200">Download Receipt ⬇️</button>
              </>
            )}
          </div>
        </div>
      </div>

      {showPayModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl animate-in zoom-in duration-300 text-left">
            <h3 className="text-xl font-black mb-2 italic uppercase tracking-tighter">PAY TO {matchData.name}</h3>
            <p className="text-[10px] text-slate-400 font-bold mb-6 uppercase tracking-widest italic text-left">Enter your UPI Details below</p>
            
            <form onSubmit={handlePayment} className="space-y-5">
              <div className="relative text-left">
                <input 
                  name="upi_field"
                  required 
                  type="text" 
                  placeholder="e.g. yourname@okaxis" 
                  className="w-full bg-slate-100 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-green-500 focus:bg-white transition-all text-slate-800"
                />
                {/* --- ENGLISH GUIDE MESSAGE --- */}
                <p className="text-[9px] text-slate-400 mt-2 ml-2 font-bold uppercase italic text-left">Format: username@bankname</p>
              </div>
              
              <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest shadow-lg hover:bg-black active:scale-95 transition-all">Proceed ₹{matchData.price}</button>
              <button type="button" onClick={() => setShowPayModal(false)} className="w-full text-slate-400 font-bold text-[10px] uppercase mt-2 hover:text-slate-600">Cancel Payment</button>
            </form>
          </div>
        </div>
      )}
      <button onClick={() => window.history.back()} className="fixed bottom-6 left-6 z-50 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-full shadow-2xl font-black text-[10px] uppercase hover:bg-slate-50 transition-colors">Back</button>
    </div>
  );
};

export default MatchDetails;