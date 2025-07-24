const Trade = require("../models/Trade.jsx");
const parseCSV = require("../utils/csvParser.jsx");
const path = require("path");
const fs = require("fs")
const uploadTrades = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const filePath = path.join(__dirname, "..", "uploads", file.filename);
        const trades = await parseCSV(filePath); // parse CSV file to trades array

        // First, delete all existing trades
        await Trade.deleteMany({});

        // Format each trade row
        const formatted = trades.map((t) => {
            const qty = Number(t["Quantity"]) || 0;

            // Derive trade type
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
                type: type,
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

        // Insert new trades
        await Trade.insertMany(formatted);

        // Clean up uploaded file to save space (optional but recommended)
        fs.unlinkSync(filePath);

        res.json({
            message: "Trades uploaded successfully",
            count: formatted.length,
        });
    } catch (error) {
        console.error(error); // good for debugging
        res.status(500).json({ error: error.message });
    }
};

const getHoldings = async (req, res) => {
    try {
        const trades = await Trade.find();
        const holdingsMap = {};
        trades.forEach((trade) => {
            const symbol = (trade.symbol || "").trim().toUpperCase();
            const type = (trade.type || "").trim().toUpperCase();
            console.log(type)
            const quantity = parseFloat(trade.quantity) || 0;
            const price = parseFloat(trade["tradePrice"]) || 0;
            console.log(price)
            const date = trade.date ? new Date(trade.date) : null;

            if (!holdingsMap[symbol]) {
                holdingsMap[symbol] = {
                    symbol,
                    totalQuantity: 0,
                    totalInvestment: 0,
                    totalBuyQty: 0,
                    latestBuyDate: null,
                };
            }

            if (type === "BUY") {
                holdingsMap[symbol].totalQuantity += quantity;
                holdingsMap[symbol].totalInvestment += quantity * price;
                holdingsMap[symbol].totalBuyQty += quantity;

                if (
                    !holdingsMap[symbol].latestBuyDate ||
                    new Date(date) > new Date(holdingsMap[symbol].latestBuyDate)
                ) {
                    holdingsMap[symbol].latestBuyDate = date;
                }
            } else if (type === "SELL") {
                holdingsMap[symbol].totalQuantity -= quantity;
            }
        });

        const masterHoldings = Object.values(holdingsMap).map((h) => ({
            symbol: h.symbol,
            totalQuantity: h.totalQuantity,
            avgBuyPrice:
                h.totalBuyQty > 0
                    ? Number((h.totalInvestment / h.totalBuyQty).toFixed(2))
                    : 0,
            totalInvestment: Number(h.totalInvestment.toFixed(2)),
            latestBuyDate: h.latestBuyDate,
        }));

        res.json({ holdings: masterHoldings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { uploadTrades, getHoldings };
