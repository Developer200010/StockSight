const Trade = require("../models/Trade.jsx");


// Helper: Compute holdings from trades
async function calculateHoldings() {
  const trades = await Trade.find({});
  const holdings = {};

  for (const t of trades) {
    const symbol = t.symbol.toUpperCase();
    if (!holdings[symbol]) {
      holdings[symbol] = {
        symbol,
        quantity: 0,
        totalCost: 0,
        avgPrice: 0,
      };
    }
    // Add quantity
    holdings[symbol].quantity += t.quantity;

    // If a buy (positive quantity), update cost
    if (t.quantity > 0) {
      holdings[symbol].totalCost += t.quantity * t.tradePrice;
    } else if (t.quantity < 0) {
      // For sells, reduce cost proportionally (average method)
      // This method works as long as average cost is kept in line with net shares
      const sellQty = Math.abs(t.quantity);
      if (holdings[symbol].quantity !== 0) {
        const avg = holdings[symbol].totalCost / (holdings[symbol].quantity + sellQty);
        holdings[symbol].totalCost -= sellQty * avg;
      }
    }
  }

  // Calculate avgPrice (skip closed positions)
  Object.values(holdings).forEach(h => {
    if (h.quantity > 0) h.avgPrice = h.totalCost / h.quantity;
  });

  // Filter only open positions
  return Object.values(holdings).filter(h => h.quantity > 0);
}

module.exports = {calculateHoldings}