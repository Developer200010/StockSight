const mongoose = require("mongoose");
const yahooFinance = require("yahoo-finance2").default;
const PriceHistory = require("./models/PriceHistory.jsx");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedPriceHistory = async (symbol) => {
  try {
    const result = await yahooFinance.chart(symbol, {
      period1: "2023-01-01",
      interval: "1d",
    });

    const priceData = result.quotes.map((q) => ({
      symbol,
      date: new Date(q.date),
      adjustedClose: q.adjclose || q.close,
      close: q.close,
    }));

    for (const entry of priceData) {
      await PriceHistory.updateOne(
        { symbol: entry.symbol, date: entry.date },
        { $set: entry },
        { upsert: true }
      );
    }

    console.log(`Seeded price history for ${symbol}`);
  } catch (err) {
    console.error("Failed to fetch data for", symbol, err.message);
  } finally {
    mongoose.disconnect();
  }
};

// Example call
seedPriceHistory("AAPL");