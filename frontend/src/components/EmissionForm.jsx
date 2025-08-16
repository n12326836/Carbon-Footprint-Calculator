import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const empty = {  type: '', amount: '', unit: '', factor: '', note: '' };

export default function EmissionForm({ emissions, setEmissions, editing, setEditing }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(empty);

  useEffect(() =>  {
    if (editing) {
      setFormData({
        type: editing.type || '',
        amount: editing.amount ?? '',
        unit: editing.unit || '',
        factor: editing.factor ?? '',
        note: editing.note || '',
      });
    } else {
      setFormData(empty);
    }
  }, [editing]);    

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const response = await axiosInstance.put(`/api/emission/${editing._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEmissions(emissions.map((x )=> x._id === response.data._id ? response.data : x));
      } else {
        const response = await axiosInstance.post('/api/emission', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEmissions([...emissions, response.data]);
      }
      setEditing(null);
      setFormData(empty);
    }catch (err) {
      alert('Failed to save emission.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editing ? 'Your emission record' : 'Create Emission Record'}</h1>
      <input
        type="text"
        placeholder="type(e.g. fuel)"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount:  e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="text"
        placeholder="unit (L/kg/kWh)"
        value={formData.unit}
        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="number"
        step="any"
        placeholder="factor"
        value={formData.factor}
        onChange={(e) => setFormData({ ...formData, factor: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />


      <input
      type="text"
        placeholder="note"
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        
      />
    <div className="flex gap-2">
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editing ? 'Update Button' : 'Create Button'}
      </button>
      </div>
    </form>
  );
}

