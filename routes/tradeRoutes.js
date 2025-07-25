const express = require("express");
const multer = require("multer");
const Trade = require("../models/Trade.js");
const connectDB = require("../config/db.js"); // ✅ Add this

const { uploadTrades } = require("../controllers/tradeController.js");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload route — controller handles db connect
router.post("/upload", upload.single("file"), uploadTrades);

// GET all trades
router.get("/", async (req, res) => {
  try {
    await connectDB(); // ✅ Ensure DB is connected
    const trades = await Trade.find().sort({ date: -1 });
    res.json({ success: true, trades });
  } catch (error) {
    console.error("Error fetching trades:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
