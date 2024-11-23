const mongoose = require("mongoose")

const questionSchema = mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },
        player_combinations: [
            {
                player1: { type: Number, required: true },
                player2: { type: Number, required: true },
            },
        ],
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Question", questionSchema)
