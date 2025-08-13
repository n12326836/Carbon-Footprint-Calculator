// backend/models/Emission.js
const mongoose = require('mongoose');

const EmissionSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:    { type: String, required: true }, // 'fuel' | 'electricity' ...
  subtype: { type: String },                 // 'petrol' | 'diesel' ...
  amount:  { type: Number, required: true },
  unit:    { type: String, required: true }, // 'L', 'kWh', ...
  factor:  { type: Number, required: true },
  note:    { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Emission', EmissionSchema);
