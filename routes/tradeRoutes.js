const express = require("express");
const multer = require("multer");
const path = require("path");
const Trade = require('../models/Trade.js');

const { uploadTrades, getHoldings } = require("../controllers/tradeController.js")

const router = express.Router();

const tmpUploadsPath = path.join('/tmp', 'uploads');
// If needed, create directory at runtime:
if (!fs.existsSync(tmpUploadsPath)) {
  fs.mkdirSync(tmpUploadsPath, { recursive: true });
}
const upload = multer({ dest: tmpUploadsPath });


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