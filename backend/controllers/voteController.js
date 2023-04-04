const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const Vote = require("../models/voteModel")
const User = require("../models/userModel")
const Players = require("../../frontend/src/players.json")

const getVote = asyncHandler(async (req, res) => {
    try {
        const votes = await Vote.find()

        // count individual votes
        let count = {}
        for (let i = 0; i < votes.length; i++) {
            let property = votes[i].winner
            if (count.hasOwnProperty(property)) {
                count[property] += 1
            } else {
                count[property] = 1
            }
        }
        const leaderboard = Object.entries(count).sort((a, b) => b[1] - a[1])

        // convert IDs to names
        let numPlayers = 0
        for (let i = 0; i < leaderboard.length; i++) {
            // limit to 50 players
            if (numPlayers >= 50) {
                leaderboard.length = 50
                break
            }
            for (player of Players) {
                if (leaderboard[i][0] == player.personId) {
                    leaderboard[i][0] = player.name
                    numPlayers += 1
                    break
                }
            }
            // remove players that are no longer in active players list
            if (parseInt(leaderboard[i][0])) {
                leaderboard.splice(i, 1)
                i--
            }
        }
        res.status(200).json(leaderboard)
    } catch (error) {
        console.error(error)
        res.status(500).json("Could not fetch leaderboard")
    }
})

const setVote = asyncHandler(async (req, res) => {
    try {
        let now = new Date().toLocaleString("en-US", { timeZone: "UTC" })

        // validate request
        if (!(req.body.winner && req.body.winnerTeam && req.body.losers)) {
            res.status(400).json(
                "Please include winner's player and team ID along with losers' player IDs"
            )
            return
        }

        // create vote
        const vote = await Vote.create({
            winner: req.body.winner,
            winnerTeam: req.body.winnerTeam,
            losers: req.body.losers,
        })
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            userToUpdate = await User.findById(decoded.id)
            userToUpdate.votes.push(vote)
            userToUpdate.save()
        }
        res.status(200).json(vote)
    } catch (error) {
        res.status(500).json("Could not post vote")
    }
})

module.exports = { getVote, setVote }
