const mongoose = require("mongoose")

const goatSchema = mongoose.Schema(
    {
        lebron: { type: Number, default: 0 },
        jordan: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("GOAT", goatSchema, "goat")
