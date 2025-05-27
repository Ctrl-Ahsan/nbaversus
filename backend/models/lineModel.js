const mongoose = require("mongoose")

const lineSchema = new mongoose.Schema(
    {
        uid: { type: String },
        personId: { type: Number, required: true },
        name: { type: String, required: true },
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
