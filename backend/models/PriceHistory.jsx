const mongoose = require("mongoose");

const PriceHistorySchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  adjustedClose: {
    type: Number,
    required: true,
  },
  close: {
    type: Number,
  },
});

PriceHistorySchema.index({ symbol: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("PriceHistory", PriceHistorySchema);