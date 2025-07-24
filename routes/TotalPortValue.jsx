const router = require("express").Router()
const {getTotalPortfolioValue, getPortfolioOverview}  = require("../controllers/portfolioValue.jsx")

router.get("/value",getTotalPortfolioValue);
router.get("/overview", getPortfolioOverview)

module.exports = router;