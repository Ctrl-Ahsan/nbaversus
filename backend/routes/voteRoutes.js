const express = require("express")
const router = express.Router()
const { getVote, setVote } = require("../controllers/voteController")

router.get("/", getVote)

router.post("/", setVote)

module.exports = router
