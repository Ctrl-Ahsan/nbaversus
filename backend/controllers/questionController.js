const asyncHandler = require("express-async-handler")
const Question = require("../models/questionModel")
const GOAT = require("../models/goatModel")

// Add a question pool
const addQuestion = asyncHandler(async (req, res) => {
    const { question, players } = req.body

    // Validate the input
    if (!question || !players || players.length < 2) {
        res.status(400).json(
            "A question and an array of at least two players are required."
        )
    }

    // Validate that all players have id and teamId
    if (
        !Array.isArray(players) ||
        !players.every(
            (player) =>
                typeof player.id === "number" &&
                typeof player.teamId === "number"
        )
    ) {
        return res.status(400).json({
            message: "Players must be an array of objects with id and teamId.",
        })
    }

    // Generate all 2-player combinations
    const combinations = []
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            combinations.push({
                player1: players[i],
                player2: players[j],
            })
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

// Vote for GOAT
const voteForGoat = asyncHandler(async (req, res) => {
    const { playerId } = req.body

    if (!playerId) {
        return res.status(400).json({ message: "Player ID is required." })
    }

    try {
        // Find the GOAT vote document (assuming only one exists)
        let goat = await GOAT.findOne()

        if (!goat) {
            // Initialize the GOAT vote document if it doesn't exist
            goat = await GOAT.create({
                lebron: 0,
                jordan: 0,
            })
        }

        // Increment the appropriate vote count
        if (playerId === 2544) {
            goat.lebron += 1 // LeBron's ID
        } else if (playerId === 893) {
            goat.jordan += 1 // Jordan's ID
        } else {
            return res.status(400).json({ message: "Invalid player ID." })
        }

        await goat.save()

        res.status(200).json({
            message: "Vote recorded successfully.",
            lebron: goat.lebron,
            jordan: goat.jordan,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = { addQuestion, voteForGoat }
