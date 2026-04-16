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

  // --- UPDATED DOWNLOAD FUNCTION ---
  const downloadReceipt = async () => {
    const element = receiptRef.current;
    
    // Save original mobile styles
    const originalWidth = element.style.width;
    const originalPadding = element.style.padding;

    // Force Desktop layout for capture (Fixes mobile breaking issue)
    element.style.width = '800px'; 
    element.style.padding = '40px';

    toast.loading("Generating PDF...");

    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        backgroundColor: '#ffffff', 
        useCORS: true, // Fixes QR code missing
        logging: false 
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = 180;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 15, 30, pdfWidth, pdfHeight);
      pdf.save(`${matchData.name.replace(/\s/g, '_')}_Receipt.pdf`);
      
      toast.dismiss();
      toast.success("Receipt Downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Download failed!");
    } finally {
      // Restore mobile styles immediately
      element.style.width = originalWidth;
      element.style.padding = originalPadding;
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    const upiInput = e.target.upi_field.value.trim();
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

    if (!upiRegex.test(upiInput)) {
      toast.error("Please enter a valid UPI ID");
      return;
    }

    toast.loading("Processing Payment...");
    
    setTimeout(() => {
      setIsPaid(true);
      setShowPayModal(false);
      toast.dismiss();
      toast.success(`Payment Successful! 🏏`);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#16a34a', '#ffffff', '#000000']
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-left">
      <Toaster position="top-center" />
      
      <div className="relative h-48 md:h-72 w-full overflow-hidden shadow-2xl">
        <img src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="header" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-12 md:mt-[-4rem] relative z-10">
        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl p-6 md:p-12 border border-white">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-10">
            <div className="w-full md:w-auto">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 inline-block ${isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {isPaid ? "Confirmed" : "Payment Pending"}
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight">
                {matchData.name}
              </h1>
              <p className="text-gray-400 font-bold mt-1 md:mt-2 italic text-xs md:text-sm">📍 {matchData.location}</p>
            </div>
            
            <div className="bg-slate-50 p-4 md:p-6 rounded-3xl md:rounded-[2.5rem] border text-center w-full md:w-auto min-w-[150px]">
              <p className="text-[10px] font-black text-gray-400 uppercase">Amount</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">₹{matchData.price}</p>
            </div>
          </div>

          <hr className="border-slate-100 mb-8 md:mb-10" />

          {/* Receipt Section */}
          <div ref={receiptRef} className={`rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden transition-all duration-700 border-2 ${isPaid ? 'bg-white border-green-500 shadow-xl' : 'bg-white border-slate-200'}`}>
             {isPaid && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.05] md:opacity-[0.08] -rotate-12 pointer-events-none text-7xl md:text-9xl font-black text-green-600">PAID</div>
             )}
             <div className="relative z-10">
               <div className="flex justify-between items-center mb-6 md:mb-10 border-b border-slate-100 pb-6">
                  <h4 className="text-[10px] md:text-[13px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400">Official Receipt</h4>
                  <p className="text-[9px] md:text-[11px] text-slate-900 font-mono font-black bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">{isPaid ? "#CONF-9923" : "PENDING"}</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                  <div className="space-y-6 md:space-y-8">
                    <div>
                      <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black mb-1">Venue</p>
                      <p className="text-xl md:text-2xl font-black text-slate-900 italic uppercase leading-none">{matchData.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black mb-1">Timing</p>
                      <p className="text-base md:text-lg font-black text-slate-800 uppercase tracking-tighter">{matchData.date} • {matchData.time}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 md:space-y-8 md:text-right flex flex-col items-start md:items-end border-t md:border-t-0 pt-6 md:pt-0">
                    <div>
                      <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black mb-1">Total Amount</p>
                      <p className="text-3xl md:text-4xl font-black text-slate-900">₹{matchData.price}</p>
                    </div>
                    {/* UPDATED QR CODE TAG */}
                   {/* QR CODE SECTION - AUTO-FILL AMOUNT & YOUR UPI ID */}
<div className="p-4 bg-white rounded-3xl shadow-xl border-2 border-slate-200 flex flex-col items-center gap-2">
  <img 
    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      `upi://pay?pa=8200792488@axl&pn=${matchData.name}&am=${matchData.price.replace(',', '')}&cu=INR`
    )}`} 
    alt="Scan to Pay" 
    crossOrigin="anonymous" 
    className="w-32 h-32 md:w-40 md:h-40" 
  />
  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Scan to Pay ₹{matchData.price}</p>
</div>
                  </div>
               </div>
             </div>
          </div>

          <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isPaid ? (
               <button onClick={() => setShowPayModal(true)} className="md:col-span-2 bg-green-600 text-white font-black py-4 md:py-5 rounded-2xl md:rounded-[2rem] text-sm uppercase shadow-xl active:scale-95 transition-all">Pay ₹{matchData.price} Now</button>
            ) : (
              <>
                <a href={`http://googleusercontent.com/maps?q=${encodeURIComponent(matchData.name + " " + matchData.location)}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-black font-black py-4 md:py-5 rounded-2xl md:rounded-3xl flex items-center justify-center gap-3 text-xs uppercase shadow-xl">Get Directions 📍</a>
                <button onClick={downloadReceipt} className="bg-slate-100 text-slate-900 font-black py-4 md:py-5 rounded-2xl md:rounded-3xl text-xs uppercase shadow-md active:bg-slate-200">Download Receipt ⬇️</button>
              </>
            )}
          </div>
        </div>
      </div>

      {showPayModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300">
            <h3 className="text-xl font-black mb-2 italic uppercase tracking-tighter">PAY TO {matchData.name}</h3>
            <p className="text-[10px] text-slate-400 font-bold mb-6 uppercase tracking-widest italic">Enter your UPI Details below</p>
            
            <form onSubmit={handlePayment} className="space-y-5">
              <div className="relative">
                <input 
                  name="upi_field"
                  required 
                  type="text" 
                  placeholder="yourname@okaxis" 
                  className="w-full bg-slate-100 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-green-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
              
              <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 md:py-5 rounded-2xl uppercase text-xs tracking-widest shadow-lg active:scale-95">Proceed ₹{matchData.price}</button>
              <button type="button" onClick={() => setShowPayModal(false)} className="w-full text-slate-400 font-bold text-[10px] uppercase mt-2 pb-4 md:pb-0">Cancel Payment</button>
            </form>
          </div>
        </div>
      )}

      <button onClick={() => window.history.back()} className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 z-50 px-8 md:px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-full shadow-2xl font-black text-[10px] uppercase">Back</button>
    </div>
  );
};

export default MatchDetails;