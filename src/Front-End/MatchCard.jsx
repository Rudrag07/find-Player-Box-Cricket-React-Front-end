import React, { useState } from 'react';

const MatchCard = ({ onCreate }) => {
  const [form, setForm] = useState({ location: '', time: '', fee: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);
    setForm({ location: '', time: '', fee: '' });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
      <h2 className="text-xl font-semibold mb-4 text-green-700">Host a Match</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Location" className="w-full p-2 border rounded-md" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} required />
        <input type="time" className="w-full p-2 border rounded-md" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} required />
        <input type="number" placeholder="Fee per person" className="w-full p-2 border rounded-md" value={form.fee} onChange={(e) => setForm({...form, fee: e.target.value})} required />
        <button className="w-full bg-green-500 text-white py-2 rounded-md font-bold hover:bg-green-600 transition">Post Match</button>
      </form>
    </div>
  );
};

export default MatchCard;