// routes/splitRoute.js
const express = require('express');
const router = express.Router();
const { getSplits } = require('../controllers/splitController.js');

router.get('/', getSplits);

module.exports = router;
