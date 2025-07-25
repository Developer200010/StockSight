const Split = require("../models/Split.js");
const Trade = require("../models/Trade.js");
const CurrencyRate = require("../models/CurrencyRate.js");
const  fetchAdjustedPrice  = require("../utils/fetchAdjustedPrices.js");
require("dotenv").config();

const adjustTradesForSplits = async (req, res) => {
  try {
    const trades = await Trade.find({});
    const splits = await Split.find({});
    const currencyRates = await CurrencyRate.find({});

    // Map of splits by symbol
    const splitMap = {};
    for (const split of splits) {
      const [from, to] = split.ratio.split(":".trim()).map(Number);
      const ratio = to / from;
      const symbol = split.symbol.trim().toUpperCase();

      if (!splitMap[symbol]) splitMap[symbol] = [];
      splitMap[symbol].push({ date: new Date(split.date), ratio });
    }

    // Map of currency rates by date
    const rateMap = {};
    for (const r of currencyRates) {
      const key = r.date.toISOString().split("T")[0];
      rateMap[key] = r.rates;
    }

    const result = [];

    for (const trade of trades) {
      const symbol = trade.symbol.trim().toUpperCase();
      const date = new Date(trade.date);
      const dateKey = date.toISOString().split("T")[0];

      let qty = parseFloat(trade.quantity);
      let price = parseFloat(trade.tradePrice);

      if (splitMap[symbol]) {
        for (const split of splitMap[symbol]) {
          if (date < split.date) {
            qty *= split.ratio;
            price /= split.ratio;
          }
        }
      }

      const cashflow = qty * price;
      const rates = rateMap[dateKey] || { INR: 0, SGD: 0 };
      const priceData = await fetchAdjustedPrice(symbol, dateKey) || { adjustedClose: null, close: null };
      console.log(priceData)
      result.push({
        ...trade._doc,
        adjustedQuantity: qty,
        adjustedPrice: price,
        adjustedCashflow: cashflow,
        cashflowInINR: cashflow * rates.INR,
        cashflowInSGD: cashflow * rates.SGD,
        marketAdjustedClose: priceData.adjustedClose,
        marketClose: priceData.close,
        deltaFromMarket: priceData.adjustedClose ? price - priceData.adjustedClose : null,
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ failed: error.message });
  }
};

module.exports = adjustTradesForSplits;
