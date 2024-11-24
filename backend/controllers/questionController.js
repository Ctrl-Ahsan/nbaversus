const asyncHandler = require("express-async-handler")
const Question = require("../models/questionModel")
const DailyQuestions = require("../models/dailyQuestionsModel")
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
        return res
            .status(400)
            .json("Players must be an array of objects with id and teamId.")
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

// Get/generate daily questions
const getDailyQuestions = asyncHandler(async (req, res) => {
    const today = new Date().toISOString().split("T")[0] // Format: YYYY-MM-DD

    // Check if daily questions already exist
    let dailyQuestions = await DailyQuestions.findOne({ date: today })

    if (!dailyQuestions) {
        // Fetch or initialize the GOAT question in the database
        let goatQuestionData = await GOAT.findOne()

        if (!goatQuestionData) {
            goatQuestionData = await GOAT.create({
                lebron: 0,
                jordan: 0,
            })
        }

        const goatQuestion = {
            question: "GOAT",
            players: {
                player1: { id: 2544, teamId: 1610612747 }, // LeBron James
                player2: { id: 893, teamId: 1610612741 }, // Michael Jordan
            },
            votes: {
                player1Votes: goatQuestionData.lebron,
                player2Votes: goatQuestionData.jordan,
            },
        }

        // All-Time
        const allTimePool = await Question.findOne({ question: "All-Time" })
        if (!allTimePool) {
            throw new Error("All-Time question pool not found in the database.")
        }
        const allTimeQuestion = {
            question: allTimePool.question,
            players:
                allTimePool.player_combinations[
                    Math.floor(
                        Math.random() * allTimePool.player_combinations.length
                    )
                ],
            votes: { player1Votes: 0, player2Votes: 0 },
        }

        // Fetch the Active question pool
        const activePool = await Question.findOne({ question: "Active" })
        if (!activePool) {
            throw new Error("Active question pool not found in the database.")
        }
        const activeQuestion = {
            question: activePool.question,
            players:
                activePool.player_combinations[
                    Math.floor(
                        Math.random() * activePool.player_combinations.length
                    )
                ],
            votes: { player1Votes: 0, player2Votes: 0 },
        }

        // Fetch 3 random questions from the question pool (excluding All-Time and Active)
        const randomPools = await Question.aggregate([
            { $match: { question: { $nin: ["All-Time", "Active"] } } },
            { $sample: { size: 3 } },
        ])

        const randomQuestions = randomPools.map((q) => ({
            question: q.question,
            players:
                q.player_combinations[
                    Math.floor(Math.random() * q.player_combinations.length)
                ],
            votes: { player1Votes: 0, player2Votes: 0 },
        }))

        // Combine all questions
        const questions = [
            goatQuestion,
            allTimeQuestion,
            activeQuestion,
            ...randomQuestions,
        ]

        // Save the daily questions to the database
        dailyQuestions = await DailyQuestions.create({
            date: today,
            questions,
            totalVotes: 0, // Initialize total votes for the day
        })
    }

    // Transform the response to include player details
    const response = {
        date: dailyQuestions.date,
        totalVotes: dailyQuestions.totalVotes,
        questions: dailyQuestions.questions.map((q) => ({
            question: q.question,
            player_combination: {
                player1: q.players.player1,
                player2: q.players.player2,
            },
            votes: q.votes,
        })),
    }

    // Respond with the daily questions
    res.status(200).json(response)
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

module.exports = { addQuestion, voteForGoat, getDailyQuestions }
