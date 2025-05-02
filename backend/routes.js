const express = require("express")
const router = express.Router()
const {
    getSeasonStats,
    getCareerStats,
} = require("./controllers/statController")
const {
    addQuestion,
    getDailyQuestions,
    answerDailyQuestion,
    getVote,
    setVote,
} = require("./controllers/voteController")
const {
    userVisit,
    registerUser,
    loginUser,
    getMe,
} = require("./controllers/userController")
const { createCheckoutSession } = require("./controllers/paymentController")
const { optionalAuth, protect, admin } = require("./middleware/authMiddleware")
const { analyzeLine, getLineUsage } = require("./controllers/lineController")

// user routes
router.post("/users/visit", optionalAuth, userVisit)
router.post("/users", registerUser)
router.post("/users/login", loginUser)
router.get("/users/me", protect, getMe)

// vote routes
router.get("/votes", getVote)
router.post("/votes", optionalAuth, setVote)

// stats routes
router.post("/stats/season", getSeasonStats)
router.post("/stats/career", getCareerStats)

// line routes
router.get("/lines/usage", protect, getLineUsage)
router.post("/lines/analyze", protect, analyzeLine)

// question routes
router.post("/questions", admin, addQuestion)
router.get("/questions/daily", optionalAuth, getDailyQuestions)
router.post("/questions/daily", optionalAuth, answerDailyQuestion)

// payment routes
router.post("/premium/checkout", protect, createCheckoutSession)

module.exports = router
