const mongoose = require("mongoose")

const voteSchema = mongoose.Schema(
    {
        winner: {
            type: String,
        },
        loser: {
            type: String,
        },
        winnerTeam: {
            type: String,
        },
        loserTeam: {
            type: String,
        },
        skip: {
            type: [String],
            default: undefined,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Vote", voteSchema)
