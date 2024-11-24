const mongoose = require("mongoose")

const dailyQuestionsSchema = mongoose.Schema({
    date: { type: String, required: true, unique: true },
    questions: [
        {
            question: { type: String, required: true },
            players: {
                player1: {
                    personId: { type: Number, required: true },
                    name: { type: String, required: true },
                    teamId: { type: Number, required: true },
                },
                player2: {
                    personId: { type: Number, required: true },
                    name: { type: String, required: true },
                    teamId: { type: Number, required: true },
                },
            },
            votes: {
                player1: { type: Number, default: 0 },
                player2: { type: Number, default: 0 },
            },
        },
    ],
    totalVotes: { type: Number, default: 0 },
})

module.exports = mongoose.model("DailyQuestions", dailyQuestionsSchema)
