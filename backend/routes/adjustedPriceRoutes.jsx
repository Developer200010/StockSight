const express = require("express");
const router = express.Router();
const fetchAdjustedPrices = require("../utils/fetchAdjustedPrices.jsx");

router.get("/adjusted-prices", async (req, res) => {
  const { symbol, from, to } = req.query;

  if (!symbol || !from || !to) {
    return res.status(400).json({ error: "Missing symbol, from, or to" });
  }

  try {
    const data = await fetchAdjustedPrices(symbol, from, to);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
