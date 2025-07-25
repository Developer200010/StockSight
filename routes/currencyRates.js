const express = require("express");
const router = express.Router();
const { getLatestCurrencyRates } = require("../controllers/currencyRatesController.js");

router.get("/", getLatestCurrencyRates);

module.exports = router;
