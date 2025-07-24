const express = require("express");
const cors = require("cors");
const tradeRoutes = require("./routes/tradeRoutes.jsx");
// const connectDB = require("./config/db.jsx");
// const tradeSplit = require("./routes/adjustTradesForSplits.jsx")
// const fetchPriceYahoo = require("./routes/adjustedPriceRoutes.jsx")
const getTotalPortfolioValue = require("./routes/TotalPortValue.jsx")
const priceRoutes = require('./routes/priceRoute.jsx');
const getHoldings = require("./routes/holdingRoute.jsx")
const currencyRatesRoutes = require("./routes/currencyRates.jsx");
const splitRoute = require('./routes/splitRoute.jsx');
const mongoose = require("mongoose")
const app = express();
const path = require("path")
require("dotenv").config();
// connectDB();
app.use(cors())
app.use(express.json());
app.use("/api/trades", tradeRoutes);
// app.use("/api/splits", splitRoute);
// app.use("/api/tradeSplits", tradeSplit);
// app.use("/api/fetchPrice", fetchPriceYahoo);

app.use("/api/trades", tradeRoutes);
app.use("/api/portfolio", getTotalPortfolioValue)
app.use('/api/prices', priceRoutes);
app.use("/api/holdings", getHoldings)
app.use("/api/currency-rates", currencyRatesRoutes);
app.use('/api/splits', splitRoute);

if(process.env.NODE_ENV == "production") {
  app.use(
    cors({
      origin: "http://localhost:5000",
      credential: true,
    })
  );
} else {
  app.use(
    cors({
      credential: true,
    })
  );
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*any",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../","frontend","dist", "index.html"));
  })
}

// database connection function.
const dbConnect = async () => {
  try {
    if (process.env.NODE_ENV === "local") {
      await mongoose.connect("mongodb://localhost:27017/portfolio-tracker");
      console.log("local database is connected...");
    } else {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("production database is connected....");
    }
  } catch (error) {
    console.log("database connection fail...." + error);
  }
};
dbConnect();





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});