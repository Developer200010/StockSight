// controllers/portfolioController.js
const yahooFinance = require('yahoo-finance2').default;
const CurrencyRate = require('../models/CurrencyRate.js');
const Trade = require('../models/Trade.js');

async function getTotalPortfolioValue(req, res) {
  try {
    // 1. Aggregate holdings by summing trade quantities
    const trades = await Trade.find({});
    const holdingsMap = new Map();

    trades.forEach(trade => {
      // Normalize symbol to uppercase (you can adjust if needed)
      const symbol = (trade.symbol || '').toUpperCase();
      const currQty = holdingsMap.get(symbol) || 0;
      holdingsMap.set(symbol, currQty + trade.quantity);
    });

    // Remove symbols with zero or negative quantity
    for (const [symbol, qty] of holdingsMap.entries()) {
      if (qty <= 0) holdingsMap.delete(symbol);
    }

    const symbols = Array.from(holdingsMap.keys());

    if (symbols.length === 0) {
      return res.json({
        success: true,
        portfolioValue: {
          valueInUSD: 0,
          valueInINR: 0,
          valueInSGD: 0,
          currencyRateDate: null,
        },
      });
    }

    // 2. Fetch latest prices live via Yahoo Finance for all symbols
    // Warning: Parallel queries may be slow / rate limited if many symbols.

    // Map symbols -> Promises fetching their quotes
    const pricePromises = symbols.map(async symbol => {
      try {
        const quote = await yahooFinance.quote(symbol);
        return { symbol, price: quote.regularMarketPrice };
      } catch (e) {
        console.warn(`Failed fetching price for ${symbol}: ${e.message}`);
        return { symbol, price: null };
      }
    });

    const priceResults = await Promise.all(pricePromises);

    // Build lookup Map for prices
    const priceMap = new Map();
    priceResults.forEach(({ symbol, price }) => {
      if (price !== null) {
        priceMap.set(symbol, price);
      }
    });

    // 3. Fetch latest currency rates from DB
    const latestCurrencyRate = await CurrencyRate.findOne({}, {}, { sort: { date: -1 } });
    if (!latestCurrencyRate) {
      return res.status(500).json({ success: false, message: 'Currency rates not found' });
    }
    const { INR, SGD } = latestCurrencyRate.rates;

    // 4. Compute total portfolio value in USD
    let totalValueUSD = 0;
    for (const [symbol, qty] of holdingsMap.entries()) {
      const price = priceMap.get(symbol);
      if (price !== undefined) {
        totalValueUSD += qty * price;
      } else {
        console.warn(`No price found for symbol ${symbol}, skipping`);
      }
    }

    // 5. Convert total to INR and SGD
    const valueInINR = totalValueUSD * INR;
    const valueInSGD = totalValueUSD * SGD;

    // 6. Respond with calculated portfolio values
    res.json({
      success: true,
      portfolioValue: {
        valueInUSD: Number(totalValueUSD.toFixed(2)),
        valueInINR: Number(valueInINR.toFixed(2)),
        valueInSGD: Number(valueInSGD.toFixed(2)),
        currencyRateDate: latestCurrencyRate.date.toISOString(),
      },
    });

  } catch (error) {
    console.error("Error calculating portfolio value:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


async function getPortfolioOverview(req, res) {
  try {
    // Count total trades in the database
    const totalTrades = await Trade.countDocuments();

    // Fetch trades with minimal fields needed for aggregation
    const trades = await Trade.find({}, 'symbol quantity date');

    // Aggregate holdings by symbol summing quantities
    const holdingsMap = new Map();
    trades.forEach(trade => {
      const symbol = (trade.symbol || '').toUpperCase();
      const qty = holdingsMap.get(symbol) || 0;
      holdingsMap.set(symbol, qty + trade.quantity);
    });

    // Count active holdings with positive quantity
    let activeHoldingsCount = 0;
    holdingsMap.forEach(qty => {
      if (qty > 0) activeHoldingsCount++;
    });

    // Find the most recent trade date
    const latestTrade = await Trade.findOne({}, 'date').sort({ date: -1 });

    // Send response JSON
    res.json({
      success: true,
      stats: {
        totalTrades,
        activeHoldingsCount,
        lastUpdate: latestTrade ? latestTrade.date.toISOString() : null,
      }
    });
  } catch (error) {
    console.error('Error getting portfolio overview:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


module.exports = { getTotalPortfolioValue, getPortfolioOverview };
