// utils/computeXirr.js
const xirr = require('xirr');

function computeHoldingXirr(trades, currentMarketPrice, today = new Date()) {
  // trades: array of { quantity, tradePrice, date }
  const cashflows = [];

  trades.forEach(trade => {
    // Buys: negative cash flow, Sells: positive
    const amount = trade.quantity * trade.tradePrice * (trade.quantity > 0 ? -1 : 1);
    cashflows.push({
      amount,
      when: new Date(trade.date)
    });
  });

  // Compute net open quantity
  const netQty = trades.reduce((sum, t) => sum + t.quantity, 0);

  // If holding is still open, add final cash flow as if selling at market price today
  if (netQty > 0) {
    cashflows.push({
      amount: currentMarketPrice * netQty, // receive cash if you sold now
      when: today
    });
  }

  // xirr throws if cannot compute; handle errors gracefully
  try {
    const rate = xirr(cashflows);
    return rate; // e.g., 0.14 for 14% annualized return
  } catch (e) {
    return null; // or handle as needed (e.g., show "N/A")
  }
}

module.exports = computeHoldingXirr;
