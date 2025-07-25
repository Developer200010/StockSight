const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  header: String,
  dataDiscriminator: String,
  assetCategory: String,
  currency: String,
  symbol: String,
  type:String,
  date: Date,
  quantity: Number,
  tradePrice: Number,
  closePrice: Number,
  proceeds: Number,
  commFee: Number,
  basis: Number,
  realizedPL: Number,
  mtmPL: Number,
  code: String,
});

module.exports = mongoose.model("Trade", tradeSchema);
