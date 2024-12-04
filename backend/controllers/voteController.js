const { writeFile, readFile } = require("fs/promises")
const fetch = require("node-fetch")
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const Vote = require("../models/voteModel")
const User = require("../models/userModel")
const Question = require("../models/questionModel")
const DailyQuestions = require("../models/dailyQuestionsModel")
const GOAT = require("../models/goatModel")
const Players = require("../data/players.json")
const allPlayers = require("../data/allplayers.json")
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
    let response = {}

    try {
        const today = new Date().toISOString().split("T")[0] // Format: YYYY-MM-DD

        // Check if daily questions already exist
        let dailyQuestions = await DailyQuestions.findOne({ date: today })

        // Fetch or initialize daily questions
        if (!dailyQuestions) {
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
                throw new Error(
                    "All-Time question pool not found in the database."
                )
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
                throw new Error(
                    "Active question pool not found in the database."
                )
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
                res.status(500).json({
                    error: "Failed to save daily questions.",
                })
                return
            }
        }

        // Structure response
        response.dailyQuestions = dailyQuestions

        // Streaks and vote tracking for signed in users
        if (req.user) {
            const user = req.user

            // Update streak
            const lastActiveDate = user.lastActiveDate
                ? user.lastActiveDate.toISOString().split("T")[0]
                : null

            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayDate = yesterday.toISOString().split("T")[0]

            if (lastActiveDate === yesterdayDate) {
                // Continue streak
                user.currentStreak += 1
            } else if (lastActiveDate !== today) {
                // Reset streak
                user.currentStreak = 0
            }
            // Update longest streak if necessary
            if (user.currentStreak > user.longestStreak) {
                user.longestStreak = user.currentStreak
            }

            // Update lastActiveDate
            user.lastActiveDate = new Date()

            // Vote tracking
            const dailyAnswersEntry = user.dailyAnswers.find(
                (entry) => entry.date === today
            )

            let voteTracking = {}
            if (dailyAnswersEntry) {
                for (answer of dailyAnswersEntry.answers) {
                    voteTracking[answer.questionIndex] = answer.winner
                }
            }

            // Save user document and structure response
            await user.save()
            response.streak = user.currentStreak
            response.voteTracking = voteTracking
        }
        res.status(200).json(response)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to get daily questions." })
    }
})

// Answer daily questions
const answerDailyQuestion = asyncHandler(async (req, res) => {
    const { date, questionIndex, winner } = req.body

    // Validate request
    if (questionIndex === undefined || !["p1", "p2"].includes(winner)) {
        return res
            .status(400)
            .json("Invalid request. Question and winner are required.")
    }

    try {
        // Get today's date in UTC (YYYY-MM-DD format)
        const today = new Date().toISOString().split("T")[0]
        if (date !== today)
            return res.status(400).json("Daily questions expired.")

        // Fetch the daily questions for today
        const dailyQuestions = await DailyQuestions.findOne({ date: today })
        if (!dailyQuestions) {
            return res
                .status(400)
                .json({ message: "No daily questions found for today." })
        }

        // Find the specific question in the daily questions
        const dailyQuestion = dailyQuestions.questions[questionIndex]
        if (!dailyQuestion) {
            return res.status(400).json({ message: "Invalid question index." })
        }

        // Update the votes for the winner
        if (winner === "p1") {
            if (questionIndex === 0) {
                let goat = await GOAT.findOne()
                goat.lebron += 1
                await goat.save()
            }
            dailyQuestion.votes.player1 += 1
        } else {
            if (questionIndex === 0) {
                let goat = await GOAT.findOne()
                goat.jordan += 1
                await goat.save()
            }
            dailyQuestion.votes.player2 += 1
        }

        // Update total votes
        dailyQuestions.totalVotes += 1

        // Save the updated daily questions
        await dailyQuestions.save()

        // Update the user document
        if (req.user) {
            const user = req.user

            // Check if the user has a dailyAnswers entry for today
            let dailyAnswersEntry = user.dailyAnswers.find(
                (entry) => entry.date === today
            )

            if (!dailyAnswersEntry) {
                // If not, create a new entry
                dailyAnswersEntry = {
                    date: today,
                    dailyQuestionsId: dailyQuestions._id,
                    answers: [],
                }
                user.dailyAnswers.push(dailyAnswersEntry)
            }

            // Check if the user has already answered this question
            const hasAnsweredQuestion = dailyAnswersEntry.answers.some(
                (answer) => answer.questionIndex === questionIndex
            )

            if (hasAnsweredQuestion) {
                return res.status(400).json({
                    message: "You have already answered this question today.",
                })
            }

            // Add the answer to the answers array
            dailyAnswersEntry.answers.push({
                questionIndex: questionIndex,
                winner: winner,
            })

            // Save the user document
            await user.save()
        }

        res.status(200).json({
            message: "Vote recorded successfully.",
            question: dailyQuestion,
            votes: dailyQuestion.votes,
        })
    } catch (error) {
        console.error("Error posting vote:", error)
        res.status(500).json("Error posting vote.")
    }
})

const getVote = asyncHandler(async (req, res) => {
    try {
        // Use MongoDB aggregation to count votes directly
        const votes = await Vote.aggregate([
            {
                $group: {
                    _id: "$winner", // Group by the 'winner' field
                    count: { $sum: 1 }, // Count occurrences
                },
            },
            {
                $sort: { count: -1 }, // Sort by count in descending order
            },
            {
                $limit: 50, // Limit to top 50 results
            },
        ])

        // Create a map for player lookups
        const playerMap = {}
        for (const player of Players) {
            playerMap[player.personId] = player.name
        }

        // Convert IDs to names and filter out inactive players
        const leaderboard = votes
            .map((vote) => {
                if (playerMap[vote._id]) {
                    return [playerMap[vote._id], vote.count] // Replace ID with name
                }
                return null // Mark for filtering if player is not active
            })
            .filter((entry) => entry !== null) // Remove null entries

        res.status(200).json(leaderboard)
    } catch (error) {
        console.error(error)
        res.status(500).json("Could not fetch leaderboard")
    }
})

const setVote = asyncHandler(async (req, res) => {
    try {
        // validate request
        if (!(req.body.winner && req.body.winnerTeam && req.body.losers)) {
            res.status(400).json(
                "Please include winner's player and team ID along with losers' player IDs"
            )
            return
        }

        // create vote
        const vote = await Vote.create({
            winner: req.body.winner,
            winnerTeam: req.body.winnerTeam,
            losers: req.body.losers,
        })
        let winnerName = ""
        for (player of Players) {
            if (req.body.winner == player.personId) {
                winnerName = player.name
                break
            }
        }
        if (req.user) {
            userToUpdate = req.user
            userToUpdate.votes.push(vote)
            userToUpdate.save()
        }
        console.log(
            `[ACTIVITY][VERSUS] ${
                req.user ? userToUpdate.name : "A user"
            } voted for ${winnerName} | ${req.ip}`.green
        )
        res.status(200).json(vote)
    } catch (error) {
        res.status(500).json("Could not cast vote")
    }
})

module.exports = {
    addQuestion,
    getDailyQuestions,
    answerDailyQuestion,
    getVote,
    setVote,
}
