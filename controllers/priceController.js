const PriceHistory = require('../models/PriceHistory.js');

async function getLatestPrice(req, res) {
  try {
    const { symbol } = req.params;
    const latestPrice = await PriceHistory.findOne({ symbol: symbol.toUpperCase() })
                                         .sort({ date: -1 });
    if (!latestPrice) {
      return res.status(404).json({ success: false, message: 'No price found for this symbol.' });
    }
    res.json({
      success: true,
      symbol: latestPrice.symbol,
      price: latestPrice.adjustedClose,
      date: latestPrice.date
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}



async function getPriceHistory(req, res) {
  try {
    const { symbol } = req.params;
    const history = await PriceHistory.find({ symbol: symbol.toUpperCase() })
                                      .sort({ date: 1 })
                                      .select('date adjustedClose -_id');
    if (history.length === 0) {
      return res.status(404).json({ success: false, message: 'No price history found for this symbol.' });
    }
    res.json({
      success: true,
      symbol: symbol.toUpperCase(),
      history
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


module.exports = { getLatestPrice, getPriceHistory };
