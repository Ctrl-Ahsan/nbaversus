// This script fetches game logs to prepare the logs.json for NBA Versus
const { writeFileSync } = require("fs")
const fetch = require("node-fetch")

const currentSeason = "2024-25"
const PlayerGameLogs =
    "https://stats.nba.com/stats/playergamelogs?Season=" +
    currentSeason +
    "&SeasonType=Regular%20Season"

// Fetch and update game logs
const updateGameLogs = async () => {
    console.log("Fetching game logs...")

    try {
        const response = await fetch(PlayerGameLogs, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept-Language": "en-US,en;q=0.9",
                Referer: "https://www.nba.com/",
            },
        })

        if (!response.ok)
            throw new Error(`HTTP Error Status: ${response.status}`)

        const data = await response.json()
        const gameLogs = data.resultSets[0].rowSet

        let logsObj = {}
        for (log of gameLogs) {
            if (logsObj[log[1]]) {
                logsObj[log[1]].push(log)
            } else {
                logsObj[log[1]] = [log]
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

// Run script
updateGameLogs()
