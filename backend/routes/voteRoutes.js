const express = require("express")
const router = express.Router()
const { getVote, setVote } = require("../controllers/voteController")
const { mixed } = require("../middleware/authMiddleware")

router.get("/", getVote)

router.post("/", setVote)

module.exports = router
