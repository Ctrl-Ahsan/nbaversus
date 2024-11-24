const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please add a password"],
        },
        votes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Vote",
        },
        answers: [
            {
                date: { type: String, required: true }, // YYYY-MM-DD
                dailyQuestionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "DailyQuestions",
                }, // Link to the daily questions document
                answers: [
                    {
                        question: {
                            type: String,
                            required: true,
                        }, // The specific question within the daily questions
                        selectedPlayer: { type: Number, required: true }, // ID of the selected player
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("User", userSchema)
