const express = require("express");
const router = express.Router();
const { getLatestCurrencyRates } = require("../controllers/currencyRatesController.jsx");

router.get("/", getLatestCurrencyRates);

module.exports = router;
