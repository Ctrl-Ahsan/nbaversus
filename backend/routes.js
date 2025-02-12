const express = require("express")
const router = express.Router()
const {
    getSeasonStats,
    getCareerStats,
    getGameLogs,
    testGameLogs,
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
    updateMe,
} = require("./controllers/userController")
const { optionalAuth, protect, admin } = require("./middleware/authMiddleware")

// user routes
router.post("/users/visit", optionalAuth, userVisit)
router.post("/users", registerUser)
router.post("/users/login", loginUser)
router.get("/users/me", protect, getMe)
router.put("/users/me", protect, updateMe)

// vote routes
router.get("/votes", getVote)
router.post("/votes", optionalAuth, setVote)

// stats routes
router.post("/stats/season", getSeasonStats)
router.post("/stats/career", getCareerStats)
router.post("/stats/gamelogs", getGameLogs)
router.get("/stats/gamelogs", testGameLogs)

// question routes
router.post("/questions", admin, addQuestion)
router.get("/questions/daily", optionalAuth, getDailyQuestions)
router.post("/questions/daily", optionalAuth, answerDailyQuestion)

module.exports = router
