const { calculateHoldings } = require("../utils/calculateHoldings.js");
const PriceHistory = require("../models/PriceHistory.js");
const CurrencyRate = require("../models/CurrencyRate.js");
const Trade = require("../models/Trade.js");
const connectDB = require("../config/db.js");
const computeHoldingXirr = require("./computeXirr.js");  // import helper

async function getHoldings(req, res) {
  try {
    await connectDB();
    // 1. Calculate holdings from trade history
    const holdings = await calculateHoldings();
    const symbols = holdings.map(h => h.symbol);

    // 2. Get latest prices
    const priceDocs = await PriceHistory.aggregate([
      { $match: { symbol: { $in: symbols } } },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$symbol",
          adjustedClose: { $first: "$adjustedClose" }
        }
      }
    ]);
    const priceMap = new Map(priceDocs.map(p => [p._id, p.adjustedClose]));

    // 3. Get latest currency rates
    const currencyDoc = await CurrencyRate.findOne({}, {}, { sort: { date: -1 } });
    const { INR, SGD } = currencyDoc.rates;

    // 4. For each holding, fetch trades & compute XIRR
    const today = new Date();

    const result = [];
    for (const h of holdings) {
      const marketPrice = priceMap.get(h.symbol) || h.avgPrice; // fallback on avgPrice
      const valueUSD = h.quantity * marketPrice;
      const valueINR = valueUSD * INR;
      const valueSGD = valueUSD * SGD;
      const gainLoss = valueUSD - h.quantity * h.avgPrice;
      const gainLossPct = h.avgPrice ? (gainLoss / (h.quantity * h.avgPrice)) * 100 : 0;

      // Fetch trades for this symbol to compute XIRR
      const tradesForSymbol = await Trade.find({ symbol: h.symbol });

      const xirrRate = computeHoldingXirr(tradesForSymbol, marketPrice, today);
      const xirrPct = xirrRate !== null ? +(xirrRate * 100).toFixed(2) : null;

      result.push({
        symbol: h.symbol,
        quantity: h.quantity,
        avgPrice: +h.avgPrice.toFixed(4),
        marketPrice: +marketPrice.toFixed(4),
        valueUSD: +valueUSD.toFixed(2),
        valueINR: +valueINR.toFixed(2),
        valueSGD: +valueSGD.toFixed(2),
        gainLoss: +gainLoss.toFixed(2),
        gainLossPct: +gainLossPct.toFixed(2),
        xirr: xirrPct,  // new field for annualized return in %
      });
    }

    res.json({ success: true, holdings: result });
  } catch (err) {
    console.error("Holdings error:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
}

module.exports = { getHoldings }
