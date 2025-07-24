// routes/splitRoute.js
const express = require('express');
const router = express.Router();
const { getSplits } = require('../controllers/splitController.jsx');

router.get('/', getSplits);

module.exports = router;
