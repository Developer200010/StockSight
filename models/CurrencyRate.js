const mongoose = require("mongoose");

const CurrencyRateSchema = new mongoose.Schema({
  date: { type: Date, unique: true },
  base: { type: String, default: "USD" },
  rates: {
    INR: { type: Number, required: true },
    SGD: { type: Number, required: true },
    // Add more if needed
  }
});

module.exports = mongoose.model("CurrencyRate", CurrencyRateSchema);
