const mongoose = require("mongoose")

const voteSchema = mongoose.Schema(
    {
        winner: {
            type: String,
        },
        winnerTeam: {
            type: String,
        },
        losers: {
            type: [String],
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Vote", voteSchema)
