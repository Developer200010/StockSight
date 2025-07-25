// seedSplits.js
const mongoose = require('mongoose');
const Split = require('./models/Split.js');
// const connectDB = require('./config/db.js');
require("dotenv").config()
async function seedSplits() {
  // await connectDB();
  mongoose.connect(process.env.MONGO_URL)
  await Split.deleteMany({});

  await Split.insertMany([
    { symbol: "AAPL", splitDate: new Date("2020-08-31"), splitRatio: 4, description: "4-for-1 stock split" },
    { symbol: "TSLA", splitDate: new Date("2020-08-31"), splitRatio: 5, description: "5-for-1 stock split" },
    { symbol: "GOOG", splitDate: new Date("2014-04-03"), splitRatio: 2, description: "2-for-1 stock split" },
  ]);

  console.log('Split data seeded!');
  process.exit(0);
}

seedSplits();
