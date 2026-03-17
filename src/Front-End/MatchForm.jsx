import React, { useState } from 'react';
import toast, { Toaster } from "react-hot-toast";
const MatchForm = ({ onCreate }) => {
  const [form, setForm] = useState({
    location: '',
    time: '',
    fee: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Home.jsx ke handleCreate function ko data bhej rahe hain
    onCreate(form);
    // Form ko reset (khali) karne ke liye
    setForm({ location: '', time: '', fee: '' });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
      <h2 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2">
        🏏 Host a Match
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Location Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Location</label>
          <input 
            type="text" 
            placeholder="e.g. Decathlon Box, SG Highway" 
            className="w-full p-2 border rounded-lg focus:outline-green-500 transition-all"
            value={form.location}
            onChange={(e) => setForm({...form, location: e.target.value})}
            required
          />
        </div>

        {/* Time Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Select Time</label>
          <input 
            type="time" 
            className="w-full p-2 border rounded-lg focus:outline-green-500 transition-all"
            value={form.time}
            onChange={(e) => setForm({...form, time: e.target.value})}
            required
          />
        </div>

        {/* Fee Input */}
       <div>
  <label className="block text-sm font-semibold text-gray-600 mb-1">Entry Fee (Per Player)</label>
  <input 
    type="number" 
    placeholder="₹ 100" 
    min="100"       // Isse 100 se niche nahi jayega (negative block ho jayega)
    step="50"      // (Optional) Isse arrows dabane par seedha 100, 150, 200 aise badhega
    className="w-full p-2 border rounded-lg focus:outline-green-500 transition-all"
    value={form.fee}
    onChange={(e) => setForm({...form, fee: e.target.value})}
    required
  />
</div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-95"
        >
          Post Match
        </button>
      </form>
    </div>
  );
};

export default MatchForm;