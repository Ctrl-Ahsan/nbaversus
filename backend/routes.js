const express = require("express")
const router = express.Router()
const { getStats } = require("./controllers/statController")
const { getVote, setVote } = require("./controllers/voteController")
const {
    registerUser,
    loginUser,
    getMe,
    updateMe,
} = require("./controllers/userController")
const { protect } = require("./middleware/authMiddleware")

// user routes
router.post("/users", registerUser)
router.post("/users/login", loginUser)
router.get("/users/me", protect, getMe)
router.put("/users/me", protect, updateMe)

// vote routes
router.get("/votes", getVote)
router.post("/votes", setVote)

// stats route
router.post("/stats", getStats)

module.exports = router
