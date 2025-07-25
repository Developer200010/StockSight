const express = require("express");
const multer = require("multer");
const Trade = require("../models/Trade.js");
const connectDB = require("../config/db.js"); // ✅ Add this

const { uploadTrades } = require("../controllers/tradeController.js");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload route — controller handles db connect
router.post("/upload", upload.array("files", 3), uploadTrades);

// GET all trades
router.get("/", async (req, res) => {
  try {
    await connectDB(); // Ensure DB connection

    // Read page and limit from query params, default values
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 15;

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Fetch paginated trades sorted by date descending
    const trades = await Trade.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Count total documents to calculate total pages on frontend
    const totalTrades = await Trade.countDocuments();

    res.json({
      success: true,
      trades,
      pagination: {
        total: totalTrades,
        page,
        limit,
        totalPages: Math.ceil(totalTrades / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching trades:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


module.exports = router;
