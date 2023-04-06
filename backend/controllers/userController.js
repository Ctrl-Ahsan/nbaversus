const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asycHandler = require("express-async-handler")
const User = require("../models/userModel")
const Vote = require("../models/voteModel")
const Players = require("../allPlayers.json")

const registerUser = asycHandler(async (req, res) => {
    try {
        const { name, password } = req.body
        let now = new Date().toLocaleString("en-US", { timeZone: "UTC" })

        // Check if all fields are present
        if (!name || !password) {
            res.status(400).send("Please include username and password")
            return
        }

        // Check if user already exists
        const userExists = await User.findOne({ name })
        if (userExists) {
            console.log(
                `${now} | A user tried taking a taken name: " +
                name | ${req.ip}`
            )
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
            console.log(`${now} ${user} created`.green)
            res.status(201).json({
                _id: user.id,
                Name: user.name,
                Token: generateToken(user.id),
            })
        } else {
            res.status(400)
            console.log(`${now} | Could not create account`.yellow)
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
        let now = new Date().toLocaleString("en-US", { timeZone: "UTC" })

        const user = await User.findOne({ name })
        if (user && (await bcrypt.compare(password, user.password))) {
            console.log(`${now} | ${user.name} logged in | ${req.ip}`.green)
            res.json({
                _id: user.id,
                Name: user.name,
                Token: generateToken(user.id),
            })
        } else {
            console.log(
                `${now} | Attempted login with invalid credentials | ${req.ip}`
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
    let response = {}

    try {
        // get user votes
        let userVotes = []
        const voteIDs = req.user.votes
        if (voteIDs.length > 0) {
            const allVotes = await Vote.find()
            for (ID of voteIDs) {
                for (vote of allVotes) {
                    if (ID.toString() === vote._id.toString()) {
                        userVotes.push(vote)
                    }
                }
            }
            // count winners
            let winnerCount = {}
            let teamCount = {}
            for (let i = 0; i < userVotes.length; i++) {
                let property = userVotes[i].winner
                if (winnerCount.hasOwnProperty(property)) {
                    winnerCount[property] += 1
                } else {
                    winnerCount[property] = 1
                }

                property = userVotes[i].winnerTeam
                if (teamCount.hasOwnProperty(property)) {
                    teamCount[property] += 1
                } else {
                    teamCount[property] = 1
                }
            }
            const winnerArray = Object.entries(winnerCount).sort(
                (a, b) => b[1] - a[1]
            )
            const teamArray = Object.entries(teamCount).sort(
                (a, b) => b[1] - a[1]
            )

            // convert IDs to names
            for (entry of winnerArray) {
                for (player of Players) {
                    if (entry[0] == player.personId) {
                        response.favoritePlayer = player.name
                        response.favoritePlayerID = entry[0]
                        response.favoritePlayerVotes = entry[1]
                        break
                    }
                }
                if (response.favoritePlayer) break
            }

            switch (teamArray[0][0]) {
                case "1610612738":
                    response.favoriteTeam = "Celtics"
                    break
                case "1610612751":
                    response.favoriteTeam = "Nets"
                    break
                case "1610612752":
                    response.favoriteTeam = "Knicks"
                    break
                case "1610612755":
                    response.favoriteTeam = "Sixers"
                    break
                case "1610612761":
                    response.favoriteTeam = "Raptors"
                    break
                case "1610612741":
                    response.favoriteTeam = "Bulls"
                    break
                case "1610612739":
                    response.favoriteTeam = "Cavaliers"
                    break
                case "1610612765":
                    response.favoriteTeam = "Pistons"
                    break
                case "1610612754":
                    response.favoriteTeam = "Pacers"
                    break
                case "1610612749":
                    response.favoriteTeam = "Bucks"
                    break
                case "1610612737":
                    response.favoriteTeam = "Hawks"
                    break
                case "1610612766":
                    response.favoriteTeam = "Hornets"
                    break
                case "1610612748":
                    response.favoriteTeam = "Heat"
                    break
                case "1610612753":
                    response.favoriteTeam = "Magic"
                    break
                case "1610612764":
                    response.favoriteTeam = "Wizards"
                    break
                case "1610612743":
                    response.favoriteTeam = "Nuggets"
                    break
                case "1610612750":
                    response.favoriteTeam = "Timberwolves"
                    break
                case "1610612760":
                    response.favoriteTeam = "Thunder"
                    break
                case "1610612757":
                    response.favoriteTeam = "Trail Blazers"
                    break
                case "1610612762":
                    response.favoriteTeam = "Jazz"
                    break
                case "1610612744":
                    response.favoriteTeam = "Warriors"
                    break
                case "1610612746":
                    response.favoriteTeam = "Clippers"
                    break
                case "1610612747":
                    response.favoriteTeam = "Lakers"
                    break
                case "1610612756":
                    response.favoriteTeam = "Suns"
                    break
                case "1610612758":
                    response.favoriteTeam = "Kings"
                    break
                case "1610612742":
                    response.favoriteTeam = "Mavericks"
                    break
                case "1610612745":
                    response.favoriteTeam = "Rockets"
                    break
                case "1610612763":
                    response.favoriteTeam = "Grizzlies"
                    break
                case "1610612740":
                    response.favoriteTeam = "Pelicans"
                    break
                case "1610612759":
                    response.favoriteTeam = "Spurs"
                    break
                default:
                    break
            }
            response.favoriteTeamID = teamArray[0][0]
            response.favoriteTeamVotes = teamArray[0][1]
        }
        res.status(200).json(response)

        let now = new Date().toLocaleString("en-US", { timeZone: "UTC" })
        console.log(
            `${now} | ${req.user.name} requested their profile | ${req.ip}`
                .green
        )
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
        expiresIn: "30d",
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateMe,
}
