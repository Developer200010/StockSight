const Trade = require("../models/Trade.js");
const parseCSV = require("../utils/csvParser.js");
const connectDB = require("../config/db.js"); // ✅ Import your DB connector

const uploadTrades = async (req, res) => {
    try {
        await connectDB(); // ✅ Ensure DB is connected before using Mongoose models

        const file = req.file;
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const trades = await parseCSV(file.buffer); // ✅ parse from memory

        await Trade.deleteMany({});

        const formatted = trades.map((t) => {
            const qty = Number(t["Quantity"]) || 0;
            let type;

            if (qty !== 0) {
                type = qty > 0 ? "BUY" : "SELL";
            } else {
                const code = (t["Code"] || "").toUpperCase();
                type = code.includes("C") ? "SELL" : "BUY";
            }

            return {
                header: t["Header"] || "",
                dataDiscriminator: t["DataDiscriminator"] || "",
                assetCategory: t["Asset Category"] || "",
                currency: t["Currency"] || "",
                symbol: (t["Symbol"] || "").trim().toUpperCase(),
                type,
                date: new Date((t["Date/Time"] || "").replace(",", "")),
                quantity: qty,
                tradePrice: Number(t["T. Price"]) || 0,
                closePrice: Number(t["C. Price"]) || 0,
                proceeds: Number(t["Proceeds"]) || 0,
                commFee: Number(t["Comm/Fee"]) || 0,
                basis: Number(t["Basis"]) || 0,
                realizedPL: Number(t["Realized P/L"]) || 0,
                mtmPL: Number(t["MTM P/L"]) || 0,
                code: t["Code"] || "",
            };
        });

        await Trade.insertMany(formatted);

        res.json({
            message: "Trades uploaded successfully",
            count: formatted.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { uploadTrades };
