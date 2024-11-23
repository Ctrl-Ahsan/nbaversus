const express = require("express")
const router = express.Router()
const {
    getSeasonStats,
    getCareerStats,
    getGameLogs,
    getLeaders,
} = require("./controllers/statController")
const { getVote, setVote } = require("./controllers/voteController")
const {
    userVisit,
    registerUser,
    loginUser,
    getMe,
    updateMe,
} = require("./controllers/userController")
const { addQuestion, voteForGoat } = require("./controllers/questionController")
const { protect, admin } = require("./middleware/authMiddleware")

// user routes
router.post("/users/visit", userVisit)
router.post("/users", registerUser)
router.post("/users/login", loginUser)
router.get("/users/me", protect, getMe)
router.put("/users/me", protect, updateMe)

// vote routes
router.get("/votes", getVote)
router.post("/votes", setVote)

// stats routes
router.get("/stats/leaders", getLeaders)
router.post("/stats/season", getSeasonStats)
router.post("/stats/career", getCareerStats)
router.post("/stats/gamelogs", getGameLogs)

// question routes
router.post("/questions", admin, addQuestion)
router.post("/questions/goat", voteForGoat)

module.exports = router
