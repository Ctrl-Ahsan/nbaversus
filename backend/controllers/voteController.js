const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const Vote = require("../models/voteModel")
const User = require("../models/userModel")
const Players = require("../players.json")

const getVote = asyncHandler(async (req, res) => {
    try {
        // Use MongoDB aggregation to count votes directly
        const votes = await Vote.aggregate([
            {
                $group: {
                    _id: "$winner", // Group by the 'winner' field
                    count: { $sum: 1 }, // Count occurrences
                },
            },
            {
                $sort: { count: -1 }, // Sort by count in descending order
            },
            {
                $limit: 50, // Limit to top 50 results
            },
        ])

        // Create a map for player lookups
        const playerMap = {}
        for (const player of Players) {
            playerMap[player.personId] = player.name
        }

        // Convert IDs to names and filter out inactive players
        const leaderboard = votes
            .map((vote) => {
                if (playerMap[vote._id]) {
                    return [playerMap[vote._id], vote.count] // Replace ID with name
                }
                return null // Mark for filtering if player is not active
            })
            .filter((entry) => entry !== null) // Remove null entries

        res.status(200).json(leaderboard)
    } catch (error) {
        console.error(error)
        res.status(500).json("Could not fetch leaderboard")
    }
})

const setVote = asyncHandler(async (req, res) => {
    try {
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
        let winnerName = ""
        for (player of Players) {
            if (req.body.winner == player.personId) {
                winnerName = player.name
                break
            }
        }
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            userToUpdate = await User.findById(decoded.id)
            userToUpdate.votes.push(vote)
            userToUpdate.save()

            console.log(
                `[ACTIVITY][PLAY] ${userToUpdate.name} voted for ${winnerName} | ${req.ip}`
                    .green
            )
        } else {
            console.log(
                `[ACTIVITY][PLAY] A user voted for ${winnerName} | ${req.ip}`
                    .green
            )
        }
        res.status(200).json(vote)
    } catch (error) {
        res.status(500).json("Could not cast vote")
    }
})

module.exports = { getVote, setVote }
