const mongoose = require("mongoose")

const lineSchema = new mongoose.Schema(
    {
        uid: { type: String, required: true },
        playerId: { type: Number, required: true },
        playerName: { type: String, required: true },
        teamId: { type: Number },
        stat: { type: String, required: true },
        operator: { type: String, enum: ["over", "under"], required: true },
        value: { type: Number },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Line", lineSchema)
