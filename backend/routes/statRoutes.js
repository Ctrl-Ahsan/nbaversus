const express = require("express")
const router = express.Router()
const { getStats } = require("../controllers/statController")

router.post("/", getStats)

module.exports = router
