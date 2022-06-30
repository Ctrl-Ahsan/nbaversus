const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const Vote = require("../models/voteModel")
const User = require("../models/userModel")

const getVote = asyncHandler(async (req, res) => {
    const votes = await Vote.find()
    res.status(200).json(votes)
})

const setVote = asyncHandler(async (req, res) => {
    if (
        !(
            req.body.winner &&
            req.body.loser &&
            req.body.winnerTeam &&
            req.body.loserTeam
        ) &&
        !req.body.skip
    ) {
        res.status(400)
        throw new Error(
            "Please must include either (i) winner ID, loser ID, winner team ID and loser team ID OR (ii) array of skipped player IDs"
        )
    }

    if (req.body.skip) {
        const vote = await Vote.create({
            skip: req.body.skip,
        })
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            userToUpdate = await User.findById(decoded.id)
            userToUpdate.skips.push(vote)
            userToUpdate.save()
        }
        res.status(200).json(vote)
    } else {
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
    }
})

module.exports = { getVote, setVote }
