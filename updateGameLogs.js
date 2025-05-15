// This script fetches game logs to prepare the logs.json for NBA Versus
const { writeFileSync } = require("fs")
const fetch = require("node-fetch")

const currentSeason = "2024-25"

const getPlayerGameLogs = async (seasonType) => {
    console.log(`Fetching ${seasonType} game logs...`)

    const url = `https://stats.nba.com/stats/playergamelogs?Season=${currentSeason}&SeasonType=${encodeURIComponent(
        seasonType
    )}`
    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept-Language": "en-US,en;q=0.9",
            Referer: "https://www.nba.com/",
        },
    })

    if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`)

    const data = await response.json()
    return data.resultSets[0].rowSet
}

const updateGameLogs = async () => {
    console.log("Starting update")

    try {
        const regularSeasonLogs = await getPlayerGameLogs("Regular Season")
        const playoffLogs = await getPlayerGameLogs("Playoffs")

        // Attach seasonType directly onto each game array
        const combinedLogs = [
            ...playoffLogs.map((log) => [...log, "Playoffs"]),
            ...regularSeasonLogs.map((log) => [...log, "Regular Season"]),
        ]

        let logsObj = {}
        for (const log of combinedLogs) {
            const playerId = log[1] // Player ID is at index 1
            if (logsObj[playerId]) {
                logsObj[playerId].push(log)
            } else {
                logsObj[playerId] = [log]
            }
        }

        // Save data to file
        writeFileSync(
            "./backend/data/logs.json",
            JSON.stringify(logsObj, null, 4),
            "utf-8"
        )

        console.log("Game logs updated successfully!")
    } catch (error) {
        console.error("Error fetching NBA API:", error.message)
    }
}

updateGameLogs()
