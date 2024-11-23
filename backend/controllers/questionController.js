const asyncHandler = require("express-async-handler")
const Question = require("../models/questionModel")

const addQuestion = asyncHandler(async (req, res) => {
    const { question, players } = req.body

    // Validate the input
    if (!question || players.length < 2) {
        res.status(400).json(
            "A question and an array of at least two players are required."
        )
    }

    // Validate that all players are numbers
    if (!players.every((id) => typeof id === "number")) {
        res.status(400).json("All player IDs must be numbers.")
    }

    // Generate all 2-player combinations
    const combinations = []
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            combinations.push({ player1: players[i], player2: players[j] })
        }
    }

    // Save to the database
    const newQuestion = await Question.create({
        question,
        player_combinations: combinations,
    })

    // Respond with a success message and minimal data
    res.status(201).json({
        message: "Question pool added successfully.",
        questionId: newQuestion._id,
        combinationCount: combinations.length,
    })
})

module.exports = { addQuestion }
