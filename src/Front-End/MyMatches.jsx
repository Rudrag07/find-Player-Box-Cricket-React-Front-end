import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyMatches = () => {
  const navigate = useNavigate();

  // Sabka data aur price alag-alag hai
  const matches = [
    { id: 1, venue: "SPORTS CLUB, AHMEDABAD", loc: "Navrangpura, Ahmedabad", date: "25th Oct", time: "09:00 PM", status: "Upcoming", type: "Family Group", price: "1,800" },
    { id: 2, venue: "DECATALON ARENA", loc: "S.G. Highway, Ahmedabad", date: "28th Oct", time: "07:30 PM", status: "Upcoming", type: "Friends Squad", price: "2,100" },
    { id: 3, venue: "THE BOX ARENA", loc: "Sindhu Bhavan, Ahmedabad", date: "20th Oct", time: "10:00 PM", status: "Completed", type: "Family Group", price: "1,500" },
    { id: 4, venue: "SHOTS BOX CRICKET", loc: "South Bopal, Ahmedabad", date: "30th Oct", time: "06:00 PM", status: "Upcoming", type: "Corporate Match", price: "1,200" },
    { id: 5, venue: "SWING BOX CRICKET", loc: "Prahlad Nagar, Ahmedabad", date: "01:00 Nov", time: "09:00 PM", status: "Upcoming", type: "Friends Squad", price: "1,600" },
    { id: 6, venue: "THE TURF ARENA", loc: "Ghatlodia, Ahmedabad", date: "02:00 Nov", time: "08:00 PM", status: "Upcoming", type: "Family Group", price: "1,400" },
  ];

  // Ye function data ko memory mein save karega
  const handleViewMatch = (match) => {
    const matchObj = {
      name: match.venue,
      location: match.loc,
      price: match.price,
      date: match.date,
      time: match.time
    };
    // Memory mein save kiya
    localStorage.setItem('currentMatchDetails', JSON.stringify(matchObj));
    // Details page pe bheja
    navigate('/matchdetails');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-left">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 italic uppercase tracking-tighter">
            My <span className="text-green-600 drop-shadow-sm">Matches</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-1 w-12 bg-green-500 rounded-full"></span>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Manage your family cricket plans</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {matches.map((match) => (
            <div key={match.id} className="bg-white p-8 rounded-[3rem] shadow-2xl border-2 border-transparent hover:border-green-500 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between">
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="bg-slate-900 text-white p-4 rounded-3xl group-hover:bg-green-600 transition-colors duration-500">
                    <span className="text-2xl font-bold italic">🏏</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                        match.status === 'Upcoming' ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {match.status}
                    </span>
                    <span className="text-lg font-black text-slate-900 italic group-hover:text-green-600">₹{match.price}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-800 mb-2 leading-none italic group-hover:text-green-700">
                  {match.venue}
                </h3>
                <p className="text-slate-400 text-sm font-extrabold flex items-center gap-2 mb-8">
                  📍 {match.loc}
                </p>

                <div className="flex gap-4 mb-8">
                  <div className="flex-1 bg-slate-50 border-b-4 border-slate-200 p-4 rounded-3xl text-center group-hover:border-green-400">
                    <p className="text-[10px] uppercase text-gray-400 font-black">Date</p>
                    <p className="font-black text-slate-800 text-base italic">{match.date}</p>
                  </div>
                  <div className="flex-1 bg-slate-50 border-b-4 border-slate-200 p-4 rounded-3xl text-center group-hover:border-green-400">
                    <p className="text-[10px] uppercase text-gray-400 font-black">Time</p>
                    <p className="font-black text-slate-800 text-base italic">{match.time}</p>
                  </div>
                </div>

                {/* AB YE BUTTON SAHI KAAM KAREGA */}
                <button 
                  onClick={() => handleViewMatch(match)}
                  className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 group-hover:bg-green-500 group-hover:text-black shadow-xl transition-all active:scale-95"
                >
                  <span className="tracking-tighter uppercase text-xs">VIEW MATCH DETAILS</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyMatches;