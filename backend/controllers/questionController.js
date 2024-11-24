const asyncHandler = require("express-async-handler")
const Question = require("../models/questionModel")
const DailyQuestions = require("../models/dailyQuestionsModel")
const GOAT = require("../models/goatModel")

// Add a question pool
const addQuestion = asyncHandler(async (req, res) => {
    const { question, players } = req.body

    // Validate the input
    if (!question || !players || players.length < 2) {
        return res
            .status(400)
            .json(
                "A question and an array of at least two players are required."
            )
    }

    // Validate that all players have personId, teamId, and name
    if (
        !Array.isArray(players) ||
        !players.every(
            (player) =>
                typeof player.name === "string" &&
                typeof player.personId === "number" &&
                typeof player.teamId === "number"
        )
    ) {
        return res
            .status(400)
            .json(
                "Players must be an array of objects with personId, teamId, and name."
            )
    }

    // Save the question pool to the database
    const newQuestion = await Question.create({
        question,
        players,
    })

    res.status(201).json({
        message: "Question pool added successfully.",
        question,
        questionId: newQuestion._id,
        playerCount: players.length,
    })
})

// Get/generate daily questions
const getDailyQuestions = asyncHandler(async (req, res) => {
    const today = new Date().toISOString().split("T")[0] // Format: YYYY-MM-DD

    // Check if daily questions already exist
    let dailyQuestions = await DailyQuestions.findOne({ date: today })

    if (!dailyQuestions) {
        // Fetch or initialize the GOAT question
        let goatQuestionData = await GOAT.findOne()

        if (!goatQuestionData) {
            goatQuestionData = await GOAT.create({ lebron: 0, jordan: 0 })
        }

        const goatQuestion = {
            question: "GOAT",
            players: [
                {
                    personId: 2544,
                    name: "LeBron James",
                    teamId: 1610612747,
                },
                {
                    personId: 893,
                    name: "Michael Jordan",
                    teamId: 1610612741,
                },
            ],
            votes: {
                player1: goatQuestionData.lebron,
                player2: goatQuestionData.jordan,
            },
        }

        // Helper function to generate a random pair
        const generateRandomPair = (players) => {
            const pool = [...players] // Clone the array to avoid mutation
            const player1 = pool.splice(
                Math.floor(Math.random() * pool.length),
                1
            )[0]
            const player2 = pool.splice(
                Math.floor(Math.random() * pool.length),
                1
            )[0]
            return { player1, player2 }
        }

        // All-Time
        const allTimePool = await Question.findOne({ question: "All-Time" })
        if (!allTimePool) {
            throw new Error("All-Time question pool not found in the database.")
        }
        const allTimeQuestion = {
            question: "All-Time",
            players: generateRandomPair(allTimePool.players),
            votes: { player1: 0, player2: 0 },
        }

        // Active
        const activePool = await Question.findOne({ question: "Active" })
        if (!activePool) {
            throw new Error("Active question pool not found in the database.")
        }
        const activeQuestion = {
            question: "Active",
            players: generateRandomPair(activePool.players),
            votes: { player1: 0, player2: 0 },
        }

        // Random questions
        const randomPools = await Question.aggregate([
            { $match: { question: { $nin: ["All-Time", "Active"] } } },
            { $sample: { size: 3 } },
        ])

        const randomQuestions = randomPools.map((q) => ({
            question: q.question,
            players: generateRandomPair(q.players),
            votes: { player1: 0, player2: 0 },
        }))

        // Combine all questions
        const questions = [
            goatQuestion,
            allTimeQuestion,
            activeQuestion,
            ...randomQuestions,
        ]

        // Save the daily questions
        dailyQuestions = await DailyQuestions.create({
            date: today,
            questions,
            totalVotes: 0,
        })
    }

    res.status(200).json(dailyQuestions)
})

// Vote for GOAT
const voteForGoat = asyncHandler(async (req, res) => {
    const { playerId } = req.body

    if (!playerId) {
        return res.status(400).json({ message: "Player ID is required." })
    }

    try {
        let goat = await GOAT.findOne()

        if (!goat) {
            goat = await GOAT.create({
                lebron: 0,
                jordan: 0,
            })
        }

        if (playerId === 2544) {
            goat.lebron += 1
        } else if (playerId === 893) {
            goat.jordan += 1
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

module.exports = { addQuestion, voteForGoat, getDailyQuestions }
