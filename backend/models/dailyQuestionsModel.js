const mongoose = require("mongoose")

const dailyQuestionSchema = mongoose.Schema(
    {
        date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
        questions: [
            {
                question: { type: String, required: true },
                players: {
                    player1: { id: Number, teamId: Number },
                    player2: { id: Number, teamId: Number },
                },
                votes: {
                    player1Votes: { type: Number, default: 0 },
                    player2Votes: { type: Number, default: 0 },
                },
            },
        ],
        totalVotes: { type: Number, default: 0 }, // Total votes for the day
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("DailyQuestions", dailyQuestionSchema)
