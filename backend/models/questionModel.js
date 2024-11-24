const mongoose = require("mongoose")

const questionSchema = mongoose.Schema({
    question: { type: String, required: true },
    players: [
        {
            name: { type: String, required: true },
            personId: { type: Number, required: true },
            teamId: { type: Number, required: true },
        },
    ],
})

module.exports = mongoose.model("Question", questionSchema)
