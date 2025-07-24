// routes/priceRoutes.js
const express = require('express');
const router = express.Router();
const { getLatestPrice, getPriceHistory } = require('../controllers/priceController.jsx');

router.get('/:symbol', getLatestPrice);
router.get('/history/:symbol', getPriceHistory);

module.exports = router;
