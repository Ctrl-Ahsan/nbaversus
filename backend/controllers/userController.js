const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const geoip = require("geoip-lite")
const asycHandler = require("express-async-handler")
const User = require("../models/userModel")
const Vote = require("../models/voteModel")
const Players = require("../data/players.json")

let usersVisited = []

const userVisit = asycHandler(async (req, res) => {
    try {
        // log visit once per day / dyno reset
        if (!usersVisited.includes(req.ip)) {
            const location = geoip.lookup(req.ip)
            if (req.headers.authorization) {
                // Verify token
                token = req.headers.authorization.split(" ")[1]
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                const user = await User.findById(decoded.id)

                console.log(
                    `[USER] ${user.name} is online | ${location?.city} ${location?.region}, ${location?.country} | ${req.ip}`
                )
            } else {
                console.log(
                    `[USER] A new visitor from ${location?.city} ${location?.region}, ${location?.country} | ${req.ip}`
                )
            }
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
        const { name, password } = req.body

        // Check if all fields are present
        if (!name || !password) {
            res.status(400).send("Please include username and password")
            return
        }

        // Check if user already exists
        const userExists = await User.find({
            name: new RegExp(`^${name}$`, "i"),
        })
        if (userExists.length > 0) {
            res.status(400).send("This name is already taken")
            return
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create user
        const user = await User.create({
            name,
            password: hashedPassword,
        })

        if (user) {
            console.log(
                `[ACCOUNT] ${user.name} has created their account | ${req.ip}`
                    .green
            )
            res.status(201).json({
                _id: user.id,
                Name: user.name,
                Token: generateToken(user.id),
            })
        } else {
            res.status(400)
            console.log(
                `[ACCOUNT] Failed to create an account | ${req.ip}`.yellow
            )
            res.status(400).json("Could not create account")
        }
    } catch (error) {
        console.error(error)
        res.status(500).json("Registration failed")
    }
})

const loginUser = asycHandler(async (req, res) => {
    try {
        const { name, password } = req.body
        if (!(req.body.name && req.body.password)) {
            res.status(400).json("Please include username and password")
            return
        }

        const user = await User.findOne({ name })
        if (user && (await bcrypt.compare(password, user.password))) {
            console.log(`[ACCOUNT] ${user.name} logged in | ${req.ip}`.green)
            res.json({
                _id: user.id,
                Name: user.name,
                Token: generateToken(user.id),
            })
        } else {
            console.log(
                `[ACCOUNT] Attempted login with invalid credentials | ${req.ip}`
                    .yellow
            )
            res.status(400).send("Invalid credentials")
            return
        }
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
        const voteIDs = req.user.votes
        response.voteCount = voteIDs.length

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

const updateMe = asycHandler(async (req, res) => {
    const me = await User.findById(req.user.id)

    if (req.body.password) {
        samePassword = await bcrypt.compare(req.body.password, me.password)
        if (samePassword) {
            res.status(400).send("You already have these credentials")
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        me.password = hashedPassword
        me.save()
    }
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "90d",
    })
}

module.exports = {
    userVisit,
    registerUser,
    loginUser,
    getMe,
    updateMe,
}
