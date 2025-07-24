const yahooFinance = require("yahoo-finance2").default;

const fetchAdjustedPrice = async (symbol, date) => {
  try {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // Important fix

    const result = await yahooFinance.chart(symbol, {
      period1: startDate,
      period2: endDate,
      interval: "1d",
    });
    const priceData = result.quotes?.[0];
    if (!priceData) return null;

    return {
      adjustedClose: priceData.adjclose,
      close: priceData.close,
    };
  } catch (err) {
    console.error(`Failed to fetch adjusted price for ${symbol} on ${date}:`, err.message);
    return null;
  }
};

module.exports = fetchAdjustedPrice;
