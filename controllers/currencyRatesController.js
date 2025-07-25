const CurrencyRate = require("../models/CurrencyRate.js");
const yahooFinance = require("yahoo-finance2").default;

async function getLatestCurrencyRates(req, res) {
  try {
    // Try to get the latest stored rates
    let latestRate = await CurrencyRate.findOne().sort({ date: -1 });
    const today = new Date().toISOString().slice(0, 10);

    // If today's rate exists, return it immediately
    if (latestRate && latestRate.date.toISOString().slice(0, 10) === today) {
      return res.json({ success: true, rates: latestRate.rates, base: latestRate.base, date: latestRate.date });
    }

    // Otherwise, fetch new rates from Yahoo Finance
    const symbols = { INR: "USDINR=X", SGD: "USDSGD=X" };
    const fetchedRates = {};

    for (const [currency, yahooSymbol] of Object.entries(symbols)) {
      const quote = await yahooFinance.quote(yahooSymbol);
      if (!quote || !quote.regularMarketPrice) throw new Error("Unable to fetch rate for " + currency);
      fetchedRates[currency] = quote.regularMarketPrice;
    }
    fetchedRates.USD = 1;

    // Save new rates in DB
    const newRateDoc = new CurrencyRate({
      date: new Date(today),
      base: "USD",
      rates: { ...fetchedRates }
    });
    await newRateDoc.save();

    return res.json({ success: true, rates: newRateDoc.rates, base: newRateDoc.base, date: newRateDoc.date });

  } catch (error) {
    console.error("Currency rates error:", error.message);
    res.status(500).json({ success: false, message: "Failed to get currency rates" });
  }
}

module.exports = { getLatestCurrencyRates };
