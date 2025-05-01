const asyncHandler = require("express-async-handler")
const Logs = require("../data/logs.json")
const Line = require("../models/lineModel")

const analyzeLine = asyncHandler(async (req, res) => {
    try {
        const { personId, name, teamId, stat, operator, value } = req.body
        const { uid, isPremium } = req.user

        if (!personId || !stat || !name || !operator) {
            return res.status(400).json("Invalid request")
        }

        const games = Logs[personId.toString()]
        if (!games) {
            return res.status(404).json("No logs found for this player")
        }

        const gameLogs = processGameLogs(games, stat)

        // Enforce line limit for free users
        if (!isPremium) {
            const recentCount = await Line.countDocuments({
                uid,
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            })

            if (recentCount >= 25) {
                return res
                    .status(403)
                    .json("Free user daily line limit reached")
            }
        }

        // Save line to DB
        await Line.create({
            uid,
            personId,
            name,
            teamId,
            stat,
            operator,
            value,
        }).catch((err) => {
            console.error("Line save error:", err)
        })

        console.log(
            `[ACTIVITY][PROPS] Analysis requested for ${name} ${stat} ${operator} ${value} | ${req.ip}`
                .green
        )

        res.status(200).json(gameLogs)
    } catch (error) {
        console.error(error)
        res.status(500).json("Could not fetch game logs")
    }
})

const processGameLogs = (games, stat) => {
    const logs = []

    for (const game of games) {
        const [id, date, matchup] = [game[7], game[8], game[9]]
        let value = null

        switch (stat) {
            case "pts":
                value = game[31]
                break
            case "reb":
                value = game[23]
                break
            case "ast":
                value = game[24]
                break
            case "stl":
                value = game[26]
                break
            case "blk":
                value = game[27]
                break
            case "tov":
                value = game[25]
                break
            case "3pm":
                value = game[15]
                break
            case "pts+reb":
                value = game[31] + game[23]
                break
            case "pts+ast":
                value = game[31] + game[24]
                break
            case "ast+reb":
                value = game[24] + game[23]
                break
            case "pts+reb+ast":
                value = game[31] + game[23] + game[24]
                break
            case "stl+blk":
                value = game[26] + game[27]
                break
            case "dd":
                const doubleStats = [
                    game[31],
                    game[23],
                    game[24],
                    game[26],
                    game[27],
                ]
                doubleStats.sort((a, b) => b - a)
                value = doubleStats[0] >= 10 && doubleStats[1] >= 10
                break
            case "td":
                const tripleStats = [
                    game[31],
                    game[23],
                    game[24],
                    game[26],
                    game[27],
                ]
                tripleStats.sort((a, b) => b - a)
                value =
                    tripleStats[0] >= 10 &&
                    tripleStats[1] >= 10 &&
                    tripleStats[2] >= 10
                break
            default:
                value = null
        }

        logs.push({ id, date, matchup, stat: value })
    }

    return logs
}

module.exports = {
    analyzeLine,
}
