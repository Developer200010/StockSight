const Trade = require("../models/Trade.js");
const parseCSV = require("../utils/csvParser.js");
const connectDB = require("../config/db.js");

const uploadTrades = async (req, res) => {
  try {
    await connectDB();

    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    // Mode from query param: 'overwrite' or 'append' (default)
    const mode = req.query.mode === 'overwrite' ? 'overwrite' : 'append';

    if (mode === 'overwrite') {
      // Delete all trades before inserting new ones
      await Trade.deleteMany({});
    }

    let totalNewTrades = 0;
    const filesAlreadyExists = [];

    for (const file of files) {
      // Parse CSV file buffer to trade objects
      const trades = await parseCSV(file.buffer);

      // Format trades uniformly
      const formatted = trades.map(t => ({
        symbol: (t['Symbol'] || '').trim().toUpperCase(),
        date: new Date((t['Date/Time'] || '').replace(',', '')),
        quantity: Number(t['Quantity']) || 0,
        tradePrice: Number(t['T. Price']) || 0,
        // Add other needed fields
        type: (Number(t['Quantity']) > 0) ? 'BUY' : 'SELL',
      }));

      if (mode === 'append') {
        if (formatted.length === 0) {
          // Empty file skip
          continue;
        }

        // Duplicate check filter: any trade matching these attributes in the DB
        const duplicatesFilter = {
          $or: formatted.map(t => ({
            symbol: t.symbol,
            date: t.date,
            quantity: t.quantity,
            tradePrice: t.tradePrice,
          }))
        };

        // Find existing trades matching this file's trades
        const existingTrades = await Trade.find(duplicatesFilter).lean();

        // Check if entire file's trades already exist in DB
        if (existingTrades.length === formatted.length) {
          // Mark this file as already existing, skip insertion
          filesAlreadyExists.push(file.originalname);
          continue;
        }

        // Filter out those existing already
        const filteredTrades = formatted.filter(ft =>
          !existingTrades.some(et =>
            et.symbol === ft.symbol &&
            et.date.getTime() === ft.date.getTime() &&
            et.quantity === ft.quantity &&
            et.tradePrice === ft.tradePrice
          )
        );

        if (filteredTrades.length > 0) {
          await Trade.insertMany(filteredTrades);
          totalNewTrades += filteredTrades.length;
        }

      } else if (mode === 'overwrite') {
        // Overwrite mode: just insert all parsed trades (DB was cleared already)
        if (formatted.length > 0) {
          await Trade.insertMany(formatted);
          totalNewTrades += formatted.length;
        }
      }
    }

    // Compose response message
    let message = "";
    if (mode === 'overwrite') {
      message = `Trades uploaded successfully in overwrite mode. Total trades inserted: ${totalNewTrades}.`;
    } else {
      message = `Upload completed. Total new trades appended: ${totalNewTrades}.`;
      if (filesAlreadyExists.length > 0) {
        message += `\nSkipped files (already uploaded): ${filesAlreadyExists.join(", ")}`;
      }
    }

    return res.json({ success: true, message });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
};

module.exports = { uploadTrades };
