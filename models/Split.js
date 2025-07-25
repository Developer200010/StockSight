// models/Split.js
const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
  symbol: { type: String, required: true, uppercase: true, trim: true },
  splitDate: { type: Date, required: true },
  splitRatio: { type: Number, required: true }, // e.g., 2 for 2-for-1 split
  description: { type: String }, // Optional info about the split
}, { timestamps: true });

module.exports = mongoose.model('Split', splitSchema);
