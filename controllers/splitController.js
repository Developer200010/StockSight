// controllers/splitController.js
const Split = require('../models/Split.js');
const connectDB = require("../config/db.js");
async function getSplits(req, res) {
  try {
    await connectDB();
    const splits = await Split.find().sort({ splitDate: -1 }); // newest first
    res.json({ success: true, splits });
  } catch (error) {
    console.error('Error fetching splits:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { getSplits };
