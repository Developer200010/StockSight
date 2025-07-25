const express = require("express");
const router = express.Router();
const { getHoldings } = require("../controllers/getHoldings.js");

router.get("/", getHoldings);

module.exports = router;
