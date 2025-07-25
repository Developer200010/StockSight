const express = require("express");
const multer = require("multer");
const path = require("path");
const Trade = require('../models/Trade.js');

const {uploadTrades, getHoldings} = require("../controllers/tradeController.js")

const router = express.Router();

const upload = multer({dest:path.join(__dirname,"..","uploads")})

router.post("/upload", upload.single("file"), uploadTrades);
// router.get("/holdings", getHoldings);



// GET /api/trades — Fetch all trades, sorted by date DESC
router.get('/', async (req, res) => {
  try {
    const trades = await Trade.find().sort({ date: -1 });  // Most recent first
    res.json({ success: true, trades });
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
;