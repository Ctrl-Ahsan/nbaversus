// This script fetches player data and prepares the players.json and stats.json for NBA Versus
const { writeFileSync } = require("fs")
const fetch = require("node-fetch")
const logUpdate = require("log-update")

const failedPlayers = [] // Array to store players whose data couldn't be retrieved
const DELAY_MS = 500 // Adjust delay (in milliseconds) as needed to manage request rate

// Delay function to add pause between requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const setPlayers = async () => {
    const currentSeason = "2024-25" // Updated to the current season
    const LeagueDashPlayerStats = `https://stats.nba.com/stats/leaguedashplayerstats?LastNGames=0&LeagueID=00&MeasureType=Base&Month=0&OpponentTeamID=0&PORound=0&PerMode=PerGame&Period=0&PlusMinus=N&Rank=N&Season=${currentSeason}&SeasonType=Regular%20Season&TeamID=0&Weight=`
    const LeagueDashPlayerBio = `https://stats.nba.com/stats/leaguedashplayerbiostats?LeagueID=00&PerMode=PerGame&Season=${currentSeason}&SeasonType=Regular+Season`
    const PlayerCareerStats =
        "https://stats.nba.com/stats/playercareerstats?LeagueID=&PerMode=PerGame&PlayerID="
    const PlayerGameLogs = `https://stats.nba.com/stats/playergamelogs?DateFrom=&DateTo=&GameSegment=&LastNGames=&LeagueID=&Location=&MeasureType=&Month=&OppTeamID=&Outcome=&PORound=&PerMode=&Period=&PlayerID=&Season=${currentSeason}&SeasonSegment=&SeasonType=&ShotClockRange=&TeamID=&VsConference=&VsDivision=`

    console.log("\nFetching league data...")
    console.time("Response time")

    const leagueStatsResponse = await fetch(LeagueDashPlayerStats, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
            "Accept-Language": "en-CA,en-US;q=0.9,en;q=0.8",
            Referer: "https://www.nba.com/",
        },
    }).then((res) => res.json())

    const leagueBiosResponse = await fetch(LeagueDashPlayerBio, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
            "Accept-Language": "en-CA,en-US;q=0.9,en;q=0.8",
            Referer: "https://www.nba.com/",
        },
    }).then((res) => res.json())

    const gameLogsResponse = await fetch(PlayerGameLogs, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
            "Accept-Language": "en-CA,en-US;q=0.9,en;q=0.8",
            Referer: "https://www.nba.com/",
        },
    }).then((res) => res.json())

    const leagueStats = leagueStatsResponse.resultSets[0].rowSet
    const leagueBios = leagueBiosResponse.resultSets[0].rowSet
    const gameLogs = gameLogsResponse.resultSets[0].rowSet

    console.timeEnd("Response time")

    const allPlayers = []
    const filteredPlayers = []
    const allPlayersComplete = []

    console.log("\nFetching player stats...")
    console.time("Response time")

    for (const player in leagueStats) {
        const playerName = leagueStats[player][1]
        const playerId = leagueBios[player][0]

        logUpdate(
            `Working on player ${parseInt(player) + 1} of ${
                leagueStats.length
            } (${playerName})`
        )

        try {
            // Wait before making the next request
            await delay(DELAY_MS)

            const playerCareerStats = await fetch(
                `${PlayerCareerStats}${playerId}`,
                {
                    headers: {
                        "User-Agent":
                            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
                        "Accept-Language": "en-CA,en-US;q=0.9,en;q=0.8",
                        Referer: "https://www.nba.com/",
                    },
                }
            ).then((res) => res.json())

            // Filter players based on rank criteria
            if (
                leagueStats[player][60] <= 75 ||
                leagueStats[player][53] <= 50 ||
                leagueStats[player][52] <= 25
            ) {
                let playerObj = {
                    name: leagueBios[player][1],
                    personId: leagueBios[player][0],
                    teamId: leagueBios[player][2],
                    age: leagueBios[player][4],
                    height: leagueBios[player][5].replace("-", "'") + '"',
                    weight: leagueBios[player][7],
                }
                filteredPlayers.push(playerObj)
            }

            // Reverse the order of the player career stats if necessary
            playerCareerStats.resultSets.forEach((set) => {
                set.rowSet.reverse()
            })

            // Structure complete player data
            let playerObjComplete = {
                id: player,
                name: leagueBios[player][1],
                personId: leagueBios[player][0],
                teamId: leagueBios[player][2],
                age: leagueBios[player][4],
                height: leagueBios[player][5].replace("-", "'") + '"',
                weight: leagueBios[player][7],
                stats: playerCareerStats.resultSets,
                games: (() => {
                    let games = []
                    for (const log of gameLogs) {
                        if (log[1] === playerId) {
                            games.push(log)
                        }
                    }
                    return games
                })(),
            }

            allPlayers.push(playerObjComplete)
            allPlayersComplete.push(playerObjComplete)
        } catch (error) {
            console.error(
                `Failed to retrieve data for ${playerName} (ID: ${playerId}): ${error.message}`
            )
            failedPlayers.push({ name: playerName, id: playerId })
            continue // Skip to the next player
        }
    }

    logUpdate.clear()
    console.timeEnd("Response time")

    // Update players.json and stats.json files with new data
    const playerArrays = {
        allPlayers: allPlayers,
        filteredPlayers: filteredPlayers,
    }
    console.log("\nUpdating project files...")
    writeFileSync(
        "./frontend/src/players.json",
        JSON.stringify(playerArrays, null, 4),
        "utf-8"
    )
    writeFileSync(
        "./backend/players.json",
        JSON.stringify(allPlayersComplete, null, 4),
        "utf-8"
    )
    writeFileSync(
        "./backend/stats.json",
        JSON.stringify(leagueStats, null, 4),
        "utf-8"
    )

    // Logging player counts
    console.log(`Total players: ${leagueStats.length}`)
    console.log(
        `Players filtered: ${leagueStats.length - filteredPlayers.length}`
    )
    console.log(`Remaining players: ${filteredPlayers.length}\n`)

    if (failedPlayers.length > 0) {
        console.warn("\nFailed to retrieve data for the following players:")
        failedPlayers.forEach((player) =>
            console.warn(`${player.name} (ID: ${player.id})`)
        )
    }
    console.log("Done!\n")
}

setPlayers()
