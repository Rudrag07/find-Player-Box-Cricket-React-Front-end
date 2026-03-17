import React, { useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- ALL STYLES (Glow, Fade, QR, Calc) ---
const glowStyles = `
  @keyframes marker-glow {
    0% { filter: drop-shadow(0 0 2px #22c55e); transform: scale(1); }
    50% { filter: drop-shadow(0 0 10px #22c55e); transform: scale(1.1); }
    100% { filter: drop-shadow(0 0 2px #22c55e); transform: scale(1); }
  }
  .glow-marker { animation: marker-glow 1.5s infinite ease-in-out; border: 3px solid #4ade80 !important; }
  .fade-marker { opacity: 0.35; filter: grayscale(1); transition: all 0.5s ease; }
  .qr-modal-overlay { background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 9999; }
  .qr-card { animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
  @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
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

  // Calculator & QR States
  const [showCalc, setShowCalc] = useState(false);
  const [totalFees, setTotalFees] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [currentPerHead, setCurrentPerHead] = useState(0);

  const center = [23.0225, 72.5714];

  const onlinePlayers = useMemo(() => {
    const names = ["Rahul", "Smit", "Hardik", "Arjun", "Karan", "Aman", "Vivek", "Sagar", "Jay", "Meet", "Deep", "Raj"];
    return Array.from({ length: 55 }, (_, i) => ({
      id: i,
      name: `${names[i % names.length]}`,
      pos: [23.0225 + (Math.random() - 0.5) * 0.12, 72.5714 + (Math.random() - 0.5) * 0.12],
    }));
  }, []);

  const handleSendMessage = (e, isGroup = false) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { text: inputMessage, sender: 'me', time, type: 'text' };

    if (isGroup) {
      setGroupMessages(prev => [...prev, userMsg]);
      if (inputMessage.toLowerCase().includes("kon") || inputMessage.toLowerCase().includes("aa raha")) {
        const teamReplies = [
          { name: "Rahul", text: "Main pakka aa raha hoon! 🏏", status: 'ready', d: 800 },
          { name: "Hardik", text: "Bhai mera kaam hai, nahi aa paunga. ❌", status: 'busy', d: 1800 },
          { name: "Smit", text: "Count me in!", status: 'ready', d: 2800 },
          { name: "Arjun", text: "Ground book hai na?", status: 'ready', d: 3800 },
          { name: "Karan", text: "Aa raha hoon!", status: 'ready', d: 4800 },
          { name: "Aman", text: "Out of town hoon bhai.", status: 'busy', d: 5800 },
          { name: "Vivek", text: "Main balls le aaunga.", status: 'ready', d: 6500 },
          { name: "Sagar", text: "Ready!", status: 'ready', d: 7200 },
          { name: "Meet", text: "Nahi aa paunga.", status: 'busy', d: 8000 },
          { name: "Deep", text: "Time kya hai?", status: 'ready', d: 9000 }
        ];
        teamReplies.forEach(reply => {
          setTimeout(() => {
            setPlayerStatus(prev => ({ ...prev, [reply.name]: reply.status }));
            setGroupMessages(prev => [...prev, { text: reply.text, sender: 'other', time, name: reply.name, type: 'text' }]);
          }, reply.delay || reply.d);
        });
      }
    } else {
      setMessages(prev => [...prev, userMsg]);
      setTimeout(() => setMessages(prev => [...prev, { text: "Haan bhai bolo!", sender: 'other', time, type: 'text' }]), 1000);
    }
    setInputMessage("");
  };

  const handleShareFees = () => {
    if (!totalFees) return toast.error("Fees daalo!");
    const perHead = Math.round(totalFees / 10);
    setCurrentPerHead(perHead);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGroupMessages(prev => [...prev, { 
        text: `💰 MATCH FEES UPDATE\nTotal: ₹${totalFees}\nPer Head: ₹${perHead}`, 
        sender: 'me', time, type: 'fee_payment', amount: perHead 
    }]);
    setShowCalc(false);
    setTotalFees("");
  };

  const handleAddToGroup = (player) => {
    if (myGroup.length >= 10) return toast.error("10 Players Full!");
    if (myGroup.find(p => p.id === player.id)) return toast.error("Already in team!");
    setMyGroup([...myGroup, player]);
    toast.success(`${player.name} added!`);
  };

  return (
    <div className="h-screen w-full relative bg-slate-50 font-sans overflow-hidden">
      <style>{glowStyles}</style>
      <Toaster position="top-center" />
      
      {/* QR MODAL */}
      {showQR && (
        <div className="fixed inset-0 qr-modal-overlay flex items-center justify-center p-6 shadow-2xl">
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-xs flex flex-col items-center qr-card relative">
            <button onClick={() => setShowQR(false)} className="absolute top-6 right-8 text-slate-300 font-bold text-xl">✕</button>
            <h3 className="font-black text-slate-800 italic uppercase mb-1">Scan to Pay</h3>
            <p className="text-green-600 font-black text-lg mb-6 tracking-tight">₹{currentPerHead}</p>
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border-4 border-slate-100 mb-6">
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=8200792488@axl&am=${currentPerHead}`} alt="QR" className="w-40 h-40" />
            </div>
            <p className="text-[9px] text-slate-400 font-bold mb-6">8200792488@axl</p>
            <button onClick={() => setShowQR(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px]">Done</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="absolute top-5 left-0 right-0 z-[5000] flex justify-center px-4">
        <div onClick={() => myGroup.length > 0 && setShowGroupChat(true)} className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-200 flex justify-between items-center cursor-pointer w-full max-w-md active:scale-95">
          <div className="pl-2">
            <h2 className="font-black text-slate-900 text-sm italic uppercase tracking-tighter">Ahmedabad Squad</h2>
            <p className="text-[10px] text-green-600 font-bold uppercase">{myGroup.length > 0 ? `Team Chat (${myGroup.length}/10)` : `55+ Boys Online`}</p>
          </div>
          <div className="flex -space-x-2">
             {myGroup.slice(0, 4).map(p => (
                 <img key={p.id} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />
             ))}
          </div>
        </div>
      </div>

      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {onlinePlayers.map((player) => (
          <Marker key={player.id} position={player.pos} icon={createBoyIcon(player.name, playerStatus[player.name])} eventHandlers={{ click: () => setSelectedPlayer(player) }} />
        ))}
      </MapContainer>

      {/* PLAYER MODAL (Jahan se Group banega) */}
      {selectedPlayer && !showChat && !showGroupChat && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-xs px-4">
          <div className="bg-white rounded-[3.5rem] p-8 shadow-2xl border-t-4 border-green-500 relative text-center">
            <button onClick={() => setSelectedPlayer(null)} className="absolute top-4 right-8 text-slate-300 font-black">✕</button>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPlayer.name}`} className="w-20 h-20 rounded-full border mx-auto shadow-md" />
            <h3 className="mt-4 text-xl font-black italic uppercase tracking-tighter">{selectedPlayer.name}</h3>
            <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={() => setShowChat(true)} className="bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase">Message</button>
                <button onClick={() => handleAddToGroup(selectedPlayer)} className="bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase">Add Team</button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT WINDOW */}
      {(showChat || showGroupChat) && (
        <div className="absolute inset-0 z-[6000] bg-white flex flex-col">
          <div className="p-6 flex items-center justify-between border-b bg-green-700 text-white shadow-md">
            <div className="flex items-center gap-4">
                <button onClick={() => {setShowChat(false); setShowGroupChat(false)}} className="text-2xl font-black">←</button>
                <h3 className="font-black uppercase text-sm italic">{showGroupChat ? "Team Squad" : `Chat: ${selectedPlayer?.name}`}</h3>
            </div>
            {showGroupChat && (
              <button onClick={() => setShowCalc(!showCalc)} className="bg-amber-400 text-slate-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm">₹ Fees</button>
            )}
          </div>

          {showGroupChat && showCalc && (
            <div className="p-4 bg-slate-100 flex gap-2 shadow-inner">
                <input type="number" value={totalFees} onChange={(e) => setTotalFees(e.target.value)} placeholder="Total Fees (₹)" className="flex-1 bg-white border-2 p-3 rounded-xl font-bold text-sm outline-none" />
                <button onClick={handleShareFees} className="bg-green-600 text-white px-5 rounded-xl font-black uppercase text-[10px]">Share</button>
            </div>
          )}

          <div className="flex-1 p-6 bg-slate-50 overflow-y-auto flex flex-col gap-4">
             {(showGroupChat ? groupMessages : messages).map((msg, i) => (
                <div key={i} className={`p-4 rounded-3xl max-w-[85%] text-sm font-bold shadow-sm ${msg.sender === 'me' ? 'bg-green-600 text-white self-end rounded-br-none' : 'bg-white text-slate-800 self-start rounded-bl-none border'}`}>
                  {msg.sender === 'other' && msg.name && <p className="text-[9px] text-green-600 mb-1 font-black uppercase">{msg.name}</p>}
                  {msg.type === 'fee_payment' ? (
                    <div className="flex flex-col items-center text-center">
                       <div className="whitespace-pre-wrap mb-3">{msg.text}</div>
                       <button onClick={() => { setCurrentPerHead(msg.amount); setShowQR(true); }} className="bg-amber-400 text-slate-900 px-6 py-2 rounded-full text-[10px] font-black uppercase shadow-sm">Pay Now 📲</button>
                    </div>
                  ) : <div className="whitespace-pre-wrap">{msg.text}</div>}
                </div>
             ))}
          </div>

          <form onSubmit={(e) => handleSendMessage(e, showGroupChat)} className="p-6 border-t flex gap-2 bg-white">
            <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Type 'kon kon aa raha hai'..." className="flex-1 bg-slate-100 p-4 rounded-2xl font-bold text-sm outline-none" />
            <button type="submit" className="bg-green-600 text-white px-8 rounded-2xl font-black uppercase text-[10px]">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlayerMap;