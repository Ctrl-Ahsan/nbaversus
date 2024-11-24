const mongoose = require("mongoose")

const questionSchema = mongoose.Schema(
    {
        question: { type: String, required: true },
        player_combinations: [
            {
                player1: {
                    id: { type: Number, required: true },
                    teamId: { type: Number, required: true },
                },
                player2: {
                    id: { type: Number, required: true },
                    teamId: { type: Number, required: true },
                },
            },
        ],
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Question", questionSchema, "questions")
