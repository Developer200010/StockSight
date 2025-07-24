const { calculateHoldings } = require("../utils/calculateHoldings.jsx");
const PriceHistory = require("../models/PriceHistory.jsx");
const CurrencyRate = require("../models/CurrencyRate.jsx");
async function getHoldings(req, res) {
  try {
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

    // 4. Compose response
    const result = holdings.map(h => {
      const marketPrice = priceMap.get(h.symbol) || h.avgPrice; // fallback on avgPrice
      const valueUSD = h.quantity * marketPrice;
      const valueINR = valueUSD * INR;
      const valueSGD = valueUSD * SGD;
      const gainLoss = valueUSD - h.quantity * h.avgPrice;
      const gainLossPct = h.avgPrice ? (gainLoss / (h.quantity * h.avgPrice)) * 100 : 0;
      return {
        symbol: h.symbol,
        quantity: h.quantity,
        avgPrice: +h.avgPrice.toFixed(4),
        marketPrice: +marketPrice.toFixed(4),
        valueUSD: +valueUSD.toFixed(2),
        valueINR: +valueINR.toFixed(2),
        valueSGD: +valueSGD.toFixed(2),
        gainLoss: +gainLoss.toFixed(2),
        gainLossPct: +gainLossPct.toFixed(2)
      };
    });

    res.json({ success: true, holdings: result });

  } catch (err) {
    console.error("Holdings error:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
}

module.exports = {getHoldings}