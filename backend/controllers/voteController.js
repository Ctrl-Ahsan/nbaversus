const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const Vote = require("../models/voteModel")
const User = require("../models/userModel")

const getVote = asyncHandler(async (req, res) => {
    let now = new Date().toLocaleString("en-US", { timeZone: "UTC" })
    const votes = await Vote.find()
    res.status(200).json(votes)
})

const setVote = asyncHandler(async (req, res) => {
    let now = new Date().toLocaleString("en-US", { timeZone: "UTC" })
    if (
        !(
            req.body.winner &&
            req.body.loser &&
            req.body.winnerTeam &&
            req.body.loserTeam
        )
    ) {
        res.status(400)
        console.log(
            `${now} | Vote submitted without all parameters | ${req.ip}`.yellow
        )
        throw new Error(
            "Please include winner ID, loser ID, winner team ID and loser team ID"
        )
    }

    const vote = await Vote.create({
        winner: req.body.winner,
        loser: req.body.loser,
        winnerTeam: req.body.winnerTeam,
        loserTeam: req.body.loserTeam,
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
})

module.exports = { getVote, setVote }
