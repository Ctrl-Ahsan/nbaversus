const firebaseAdmin = require("../firebaseAdmin")
const geoip = require("geoip-lite")
const asycHandler = require("express-async-handler")
const User = require("../models/userModel")
const Vote = require("../models/voteModel")
const Players = require("../data/roster.json")

let usersVisited = []

const userVisit = asycHandler(async (req, res) => {
    try {
        // log visit once per day / dyno reset
        if (!usersVisited.includes(req.ip)) {
            const location = geoip.lookup(req.ip)
            console.log(
                `[USER] ${
                    req.user
                        ? `${req.user.name} is online |`
                        : "A new visitor from"
                } ${location?.city} ${location?.region}, ${
                    location?.country
                } | ${req.ip}`
            )
            usersVisited.push(req.ip)
            console.log(`[USER] ${usersVisited.length} visits today`)
        }
        res.status(200).json({})
    } catch (error) {
        console.error(error)
        res.status(500).json({})
    }
})

const registerUser = asycHandler(async (req, res) => {
    try {
        const authHeader = req.headers.authorization || ""
        const token = authHeader.split("Bearer ")[1]
        if (!token)
            return res.status(401).json({ message: "Missing Firebase token" })

        const decoded = await firebaseAdmin.auth().verifyIdToken(token)
        const { uid, email } = decoded
        const { name } = req.body

        if (!name || !email || !uid) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const existingUser = await User.findOne({ uid })
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
                name: existingUser.name,
                isPremium: existingUser.isPremium,
            })
        }

        const user = await User.create({ uid, email, name })

        console.log(
            `[ACCOUNT] ${user.name} has created their account | ${req.ip}`.green
        )

        res.status(201).json({
            name: user.name,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json("Registration failed")
    }
})

const loginUser = asycHandler(async (req, res) => {
    try {
        const authHeader = req.headers.authorization || ""
        const token = authHeader.split("Bearer ")[1]
        if (!token)
            return res.status(401).json({ message: "Missing Firebase token" })

        const decoded = await firebaseAdmin.auth().verifyIdToken(token)
        const { uid } = decoded

        const user = await User.findOne({ uid })

        if (!user) {
            return res.status(404).json({ message: "User not found in DB" })
        }

        console.log(`[ACCOUNT] ${user.name} logged in | ${req.ip}`.green)

        res.status(200).json({
            name: user.name,
            isPremium: user.isPremium,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json("Login failed")
    }
})

const getMe = asycHandler(async (req, res) => {
    console.log(
        `[ACCOUNT] ${req.user.name} requested their profile | ${req.ip}`.green
    )
    let response = {}

    try {
        // Set streak details
        response.currentStreak = req.user.currentStreak
        response.longestStreak = req.user.longestStreak
        response.voteCount = 0

        // Calculate and set GOAT details
        if (req.user.dailyAnswers.length > 0) {
            let lebronVotes = 0
            let jordanVotes = 0
            req.user.dailyAnswers.forEach((dailyAnswersObject) => {
                if (dailyAnswersObject.answers) {
                    dailyAnswersObject.answers.forEach((answer) => {
                        if (answer.questionIndex === 0) {
                            if (answer.winner === "p1") {
                                lebronVotes += 1
                            } else if (answer.winner === "p2") {
                                jordanVotes += 1
                            }
                        }
                        // Count user daily answers
                        response.voteCount += 1
                    })
                }
            })
            response.goat = lebronVotes > jordanVotes ? "LeBron" : "Jordan"
            response.goatVotes =
                lebronVotes > jordanVotes ? lebronVotes : jordanVotes
        }

        // Count user votes
        const voteIDs = req.user.votes
        response.voteCount += voteIDs.length

        if (voteIDs.length > 0) {
            // Fetch only the votes associated with the user
            const userVotes = await Vote.find({ _id: { $in: voteIDs } })

            // Count winners and teams using reduce
            const { winnerCount, teamCount } = userVotes.reduce(
                (counts, vote) => {
                    counts.winnerCount[vote.winner] =
                        (counts.winnerCount[vote.winner] || 0) + 1
                    counts.teamCount[vote.winnerTeam] =
                        (counts.teamCount[vote.winnerTeam] || 0) + 1
                    return counts
                },
                { winnerCount: {}, teamCount: {} }
            )

            // Convert counts to sorted arrays
            const winnerArray = Object.entries(winnerCount).sort(
                (a, b) => b[1] - a[1]
            )
            const teamArray = Object.entries(teamCount).sort(
                (a, b) => b[1] - a[1]
            )

            // Optimize player lookup by creating a Map with string keys
            const playerMap = new Map(
                Players.map((player) => [
                    player.personId.toString(),
                    player.name,
                ])
            )

            // Set favorite player details
            const favoritePlayerId = winnerArray[0][0]
            response.favoritePlayerID = favoritePlayerId
            response.favoritePlayerVotes = winnerArray[0][1]
            response.favoritePlayer = playerMap.has(favoritePlayerId)
                ? playerMap
                      .get(favoritePlayerId)
                      .split(" ")
                      .splice(1, 2)
                      .join(" ")
                : "Unknown Player"

            // Use a mapping object for team names
            const teamMap = {
                1610612738: "Celtics",
                1610612751: "Nets",
                1610612752: "Knicks",
                1610612755: "Sixers",
                1610612761: "Raptors",
                1610612741: "Bulls",
                1610612739: "Cavaliers",
                1610612765: "Pistons",
                1610612754: "Pacers",
                1610612749: "Bucks",
                1610612737: "Hawks",
                1610612766: "Hornets",
                1610612748: "Heat",
                1610612753: "Magic",
                1610612764: "Wizards",
                1610612743: "Nuggets",
                1610612750: "Timberwolves",
                1610612760: "Thunder",
                1610612757: "Trail Blazers",
                1610612762: "Jazz",
                1610612744: "Warriors",
                1610612746: "Clippers",
                1610612747: "Lakers",
                1610612756: "Suns",
                1610612758: "Kings",
                1610612742: "Mavericks",
                1610612745: "Rockets",
                1610612763: "Grizzlies",
                1610612740: "Pelicans",
                1610612759: "Spurs",
            }

            // Set favorite team details
            const favoriteTeamId = teamArray[0][0]
            response.favoriteTeamID = favoriteTeamId
            response.favoriteTeamVotes = teamArray[0][1]
            response.favoriteTeam = teamMap[favoriteTeamId] || "Unknown Team"
        }

        res.status(200).json(response)
    } catch (error) {
        console.error(error)
        res.status(500).json("Could not fetch profile")
    }
})

module.exports = {
    userVisit,
    registerUser,
    loginUser,
    getMe,
}
