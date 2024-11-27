const { writeFile, readFile } = require("fs/promises")
const fetch = require("node-fetch")
const asyncHandler = require("express-async-handler")
const allPlayers = require("../data/allplayers.json")
const Question = require("../models/questionModel")
const DailyQuestions = require("../models/dailyQuestionsModel")
const GOAT = require("../models/goatModel")
const path = require("path")
const allTimePath = path.join(__dirname, "../data/alltime.json")

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

    let allTime = JSON.parse(await readFile(allTimePath, "utf-8"))

    // Fetch player teamId from NBA API
    const getTeamId = async (personId) => {
        try {
            const response = await fetch(
                `https://stats.nba.com/stats/commonplayerinfo?PlayerID=${personId}`,
                {
                    headers: {
                        "User-Agent":
                            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
                        Referer: "https://www.nba.com/",
                        "Accept-Language": "en-US,en;q=0.9",
                    },
                }
            )
            const data = await response.json()

            const teamId = data.resultSets?.[0]?.rowSet?.[0]?.[18] || 0

            if (teamId === 0) {
                throw new Error(
                    `Player with personId: ${personId} is not associated with a team.`
                )
            }

            return teamId
        } catch (error) {
            console.error(
                `Error fetching teamId for personId ${personId}:`,
                error.message
            )
            throw new Error("Failed to fetch teamId from NBA API.")
        }
    }

    // Resolve player data
    const resolvedPlayers = []
    for (const playerName of players) {
        // Player is not in alltime.json
        if (!allTime[playerName]) {
            // Get personId from allplayers.json
            const playerRow = allPlayers.resultSets[0].rowSet.find(
                (row) => row[2] === playerName
            )

            if (!playerRow) {
                throw new Error(
                    `Player '${playerName}' not found in commonallplayers.json.`
                )
            }

            const personId = playerRow[0]

            let teamId = playerRow[8] // TEAM_ID in rowSet

            // Check if teamId is missing (0) and fetch dynamically
            if (teamId === 0) {
                teamId = await getTeamId(personId)
            }

            // Add player to alltime.json
            allTime[playerName] = { personId, teamId }
        }

        // Add resolved player data to the result array
        resolvedPlayers.push({
            name: playerName,
            personId: allTime[playerName].personId,
            teamId: allTime[playerName].teamId,
        })
    }

    // Save the updated alltime.json
    await writeFile(allTimePath, JSON.stringify(allTime, null, 2))

    // Save the question pool to the database
    const newQuestion = await Question.create({
        question,
        players: resolvedPlayers,
    })

    res.status(201).json({
        message: "Question pool added successfully.",
        questionId: newQuestion._id,
        question,
        players: resolvedPlayers,
        playerCount: resolvedPlayers.length,
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
            players: {
                player1: {
                    name: "LeBron James",
                    personId: 2544,
                    teamId: 1610612747,
                },
                player2: {
                    name: "Michael Jordan",
                    personId: 893,
                    teamId: 1610612741,
                },
            },
            votes: {
                player1: goatQuestionData.lebron,
                player2: goatQuestionData.jordan,
            },
        }

        // Generate a random pair for daily questions
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
        const allTimePair = generateRandomPair(allTimePool.players)
        const allTimeQuestion = {
            question: "All-Time",
            players: {
                player1: allTimePair.player1,
                player2: allTimePair.player2,
            },
            votes: { player1: 0, player2: 0 },
        }

        // Active
        const activePool = await Question.findOne({ question: "Active" })
        if (!activePool) {
            throw new Error("Active question pool not found in the database.")
        }
        const activePair = generateRandomPair(activePool.players)
        const activeQuestion = {
            question: "Active",
            players: {
                player1: activePair.player1,
                player2: activePair.player2,
            },
            votes: { player1: 0, player2: 0 },
        }

        // Random questions
        const randomPools = await Question.aggregate([
            { $match: { question: { $nin: ["All-Time", "Active"] } } },
            { $sample: { size: 3 } },
        ])

        const randomQuestions = randomPools.map((q) => {
            const randomPair = generateRandomPair(q.players)
            return {
                question: q.question,
                players: {
                    player1: randomPair.player1,
                    player2: randomPair.player2,
                },
                votes: { player1: 0, player2: 0 },
            }
        })

        // Combine all questions
        const questions = [
            goatQuestion,
            allTimeQuestion,
            activeQuestion,
            ...randomQuestions,
        ]

        // Save the daily questions
        try {
            dailyQuestions = await DailyQuestions.create({
                date: today,
                questions,
                totalVotes: 0,
            })
        } catch (error) {
            console.error("Error saving daily questions:", error.message)
            res.status(500).json({ error: "Failed to save daily questions." })
            return
        }
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
