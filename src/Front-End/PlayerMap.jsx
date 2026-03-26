import React, { useState, useMemo, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Fixed: Added CheckCircle to imports
import { motion, AnimatePresence } from "framer-motion"; 
import { Share2, Clock, Ticket, CreditCard, CheckCircle, MapPin, User, AlertCircle } from "lucide-react";

// --- STYLES ---
const glowStyles = `
  @keyframes marker-glow {
    0% { filter: drop-shadow(0 0 2px #22c55e); transform: scale(1); }
    50% { filter: drop-shadow(0 0 10px #22c55e); transform: scale(1.1); }
    100% { filter: drop-shadow(0 0 2px #22c55e); transform: scale(1); }
  }
  .glow-marker { animation: marker-glow 1.5s infinite ease-in-out; border: 3px solid #4ade80 !important; }
  .fade-marker { opacity: 0.35; filter: grayscale(1); transition: all 0.5s ease; }
  .qr-modal-overlay { background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 9999; }
  .qr-card { animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
  @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .leaflet-container { cursor: crosshair !important; }
`;

const createBoyIcon = (name, status) => {
    let className = "rounded-full border-2 border-green-500 bg-white shadow-lg ";
    if (status === 'ready') className += "glow-marker";
    if (status === 'busy') className += "fade-marker";

    return new L.Icon({
        iconUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        iconSize: [45, 45],
        className: className,
        iconAnchor: [22, 22],
    });
};

const PlayerMap = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showGroupChat, setShowGroupChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [myGroup, setMyGroup] = useState([]); 
  const [playerStatus, setPlayerStatus] = useState({}); 

  const [showCalc, setShowCalc] = useState(false);
  const [totalFees, setTotalFees] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [currentPerHead, setCurrentPerHead] = useState(0);

  const center = [23.0225, 72.5714];
  const [mapKey, setMapKey] = useState(Date.now());

  const onlinePlayers = useMemo(() => {
    const names = ["Rahul", "Smit", "Hardik", "Arjun", "Karan", "Aman", "Vivek", "Sagar", "Jay", "Meet", "Deep", "Raj"];
    return Array.from({ length: 55 }, (_, i) => ({
      id: i,
      name: `${names[i % names.length]}_${i}`,
      pos: [23.0225 + (Math.random() - 0.5) * 0.12, 72.5714 + (Math.random() - 0.5) * 0.12],
    }));
  }, []);

  const handleSendMessage = (e, isGroup = false) => {
    e.preventDefault();
    const msgText = inputMessage.trim();
    if (!msgText) return;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { text: inputMessage, sender: 'me', time, type: 'text' };

    if (isGroup) {
      setGroupMessages(prev => [...prev, userMsg]);
      if (myGroup.length === 0) {
        setTimeout(() => setGroupMessages(prev => [...prev, { text: "Bhai pehle team toh bana lo! 😅", sender: 'other', time, name: "System", type: 'text' }]), 800);
        setInputMessage(""); return;
      }
      // Simple bot logic for demo
      setTimeout(() => {
        setGroupMessages(prev => [...prev, { text: "Theek hai bhai, done!", sender: 'other', time, name: myGroup[0].name, type: 'text' }]);
      }, 1500);
    } else {
      setMessages(prev => [...prev, userMsg]);
      setTimeout(() => setMessages(prev => [...prev, { text: "Haan bhai, group mein aao!", sender: 'other', time, type: 'text' }]), 1000);
    }
    setInputMessage("");
  };

  const handleShareFees = () => {
    if (!totalFees || totalFees <= 0) return toast.error("Valid fees daalo!");
    const count = myGroup.length || 1; 
    const perHead = Math.round(totalFees / count);
    setCurrentPerHead(perHead);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setGroupMessages(prev => [...prev, { 
        text: `💰 MATCH FEES UPDATE\nTotal: ₹${totalFees}\nPlayers: ${count}\nPer Head: ₹${perHead}`, 
        sender: 'me', time, type: 'fee_payment', amount: perHead 
    }]);
    setShowCalc(false);
    setTotalFees("");
  };

  const handleAddToGroup = (player) => {
    if (myGroup.length >= 10) return toast.error("10 Players Full!");
    if (myGroup.find(p => p.id === player.id)) return toast.error("Already in team!");
    setMyGroup([...myGroup, player]);
    toast.success(`${player.name.split('_')[0]} added to Squad!`);
  };

  return (
    <div className="h-screen w-full relative bg-slate-50 overflow-hidden">
      <style>{glowStyles}</style>
      <Toaster position="top-center" />
      
      {/* Fixed Amount QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 qr-modal-overlay flex items-center justify-center p-6 shadow-2xl z-[9999]">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] p-8 w-full max-w-xs flex flex-col items-center qr-card relative border-4 border-green-500">
              <button onClick={() => setShowQR(false)} className="absolute top-6 right-8 text-slate-300 font-black text-xl hover:text-red-500">✕</button>
              
              <div className="bg-green-100 p-3 rounded-2xl mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              
              <h3 className="font-black text-slate-800 italic mb-1 uppercase tracking-tighter">Fixed Payment</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase mb-2 text-center">Transferring to: 8200792488@axl</p>
              
              <div className="bg-slate-50 px-6 py-2 rounded-2xl mb-6 border-2 border-dashed border-green-200">
                <p className="text-green-600 font-black text-2xl">₹{currentPerHead}</p>
              </div>

              <div className="bg-white p-4 rounded-3xl shadow-inner border-2 border-slate-100 mb-6">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    `upi://pay?pa=8200792488@axl&pn=BoxCricket_Ahmedabad&am=${currentPerHead}&cu=INR&tn=Match_Fees`
                  )}`} 
                  alt="Payment QR" 
                  className="w-40 h-40" 
                />
              </div>

              <button onClick={() => setShowQR(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all">Done</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Squad Header */}
      <div className="absolute top-5 left-0 right-0 z-[1000] flex justify-center px-4 pointer-events-none">
        <div 
          onClick={() => { if(myGroup.length > 0) setShowGroupChat(true); else toast.error("Pehle players add karo!") }} 
          className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-200 flex justify-between items-center cursor-pointer w-full max-w-md active:scale-95 transition-all pointer-events-auto"
        >
          <div className="pl-2">
            <h2 className="font-black text-slate-900 text-sm italic uppercase tracking-tighter">Ahmedabad Squad</h2>
            <p className="text-[10px] text-green-600 font-bold uppercase">{myGroup.length}/10 Players Added</p>
          </div>
          <div className="flex -space-x-2">
             {myGroup.length > 0 ? myGroup.slice(0, 4).map(p => (
                 <img key={`thumb-${p.id}`} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" alt="p" />
             )) : <span className="text-xl px-2">👥</span>}
          </div>
        </div>
      </div>

      <MapContainer key={mapKey} center={center} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {onlinePlayers.map((player) => (
          <Marker 
            key={player.id} 
            position={player.pos} 
            icon={createBoyIcon(player.name, playerStatus[player.name])} 
            eventHandlers={{ click: () => { setSelectedPlayer(player); setShowChat(false); }}} 
          />
        ))}
      </MapContainer>

      {selectedPlayer && !showChat && !showGroupChat && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-xs px-4">
          <div className="bg-white rounded-[3.5rem] p-8 shadow-2xl border-t-4 border-green-500 relative text-center">
            <button onClick={() => setSelectedPlayer(null)} className="absolute top-4 right-8 text-slate-300 font-black">✕</button>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPlayer.name}`} className="w-20 h-20 rounded-full border mx-auto shadow-md bg-slate-50" alt="p" />
            <h3 className="mt-4 text-xl font-black italic uppercase tracking-tighter">{selectedPlayer.name.split('_')[0]}</h3>
            <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={() => setShowChat(true)} className="bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase">Message</button>
                <button onClick={() => handleAddToGroup(selectedPlayer)} className="bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase">Add Team</button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Windows */}
      <AnimatePresence>
        {(showChat || showGroupChat) && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute inset-0 z-[6000] bg-white flex flex-col">
            <div className="p-6 flex items-center justify-between border-b bg-green-700 text-white shadow-md">
              <button onClick={() => {setShowChat(false); setShowGroupChat(false)}} className="text-2xl font-black">←</button>
              <h3 className="font-black uppercase text-sm italic">{showGroupChat ? "Team Squad" : selectedPlayer?.name.split('_')[0]}</h3>
              {showGroupChat && <button onClick={() => setShowCalc(!showCalc)} className="bg-amber-400 text-slate-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm">₹ Fees</button>}
            </div>

            {showGroupChat && showCalc && (
              <div className="p-4 bg-slate-100 flex gap-2 shadow-inner">
                  <input type="number" value={totalFees} onChange={(e) => setTotalFees(e.target.value)} placeholder="Total Amount" className="flex-1 bg-white border-2 p-3 rounded-xl font-bold text-sm outline-none" />
                  <button onClick={handleShareFees} className="bg-green-600 text-white px-5 rounded-xl font-black uppercase text-[10px]">Share</button>
              </div>
            )}

            <div className="flex-1 p-6 bg-slate-50 overflow-y-auto flex flex-col gap-4">
               {(showGroupChat ? groupMessages : messages).map((msg, i) => (
                  <div key={i} className={`p-4 rounded-3xl max-w-[85%] text-sm font-bold shadow-sm ${msg.sender === 'me' ? 'bg-green-600 text-white self-end rounded-br-none' : 'bg-white text-slate-800 self-start rounded-bl-none border'}`}>
                    {msg.sender === 'other' && msg.name && <p className="text-[9px] text-green-600 mb-1 font-black uppercase">{msg.name.split('_')[0]}</p>}
                    {msg.type === 'fee_payment' ? (
                      <div className="flex flex-col items-center text-center">
                         <div className="whitespace-pre-wrap mb-3">{msg.text}</div>
                         <button onClick={() => setShowQR(true)} className="bg-amber-400 text-slate-900 px-6 py-2 rounded-full text-[10px] font-black uppercase shadow-sm active:scale-95 transition-all">Pay Now 📲</button>
                      </div>
                    ) : <div className="whitespace-pre-wrap">{msg.text}</div>}
                  </div>
               ))}
            </div>

            <form onSubmit={(e) => handleSendMessage(e, showGroupChat)} className="p-6 border-t flex gap-2 bg-white">
              <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Type a message..." className="flex-1 bg-slate-100 p-4 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:bg-white focus:border-green-500 transition-all" />
              <button type="submit" className="bg-green-600 text-white px-8 rounded-2xl font-black uppercase text-[10px]">Send</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerMap;