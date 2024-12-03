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
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastActiveDate: { type: Date },
        dailyAnswers: [
            {
                date: { type: String, required: true }, // YYYY-MM-DD
                dailyQuestionsId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "DailyQuestions",
                },
                answers: [
                    {
                        questionIndex: { type: Number, required: true },
                        winner: { type: String, required: true },
                    },
                ],
            },
        ],
        votes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Vote",
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("User", userSchema)
