const mongoose = require("mongoose")

const questionSchema = mongoose.Schema({
    question: { type: String, required: true },
    players: [
        {
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
    ],
})

module.exports = mongoose.model("Question", questionSchema)
