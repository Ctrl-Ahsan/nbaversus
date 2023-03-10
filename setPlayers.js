// This script fetches player data and prepares the players.json for NBA Versus
const { writeFileSync } = require("fs")
const fetch = require("node-fetch")

const setPlayers = async () => {
    // fetch players data
    const currentSeason = "2022-23" // must change every season
    const LeagueDashPlayerStats = `https://stats.nba.com/stats/leaguedashplayerstats?LastNGames=0&LeagueID=00&MeasureType=Base&Month=0&OpponentTeamID=0&PORound=0&PerMode=PerGame&Period=0&PlusMinus=N&Rank=N&Season=${currentSeason}&SeasonType=Regular%20Season&TeamID=0&Weight=`
    const LeagueDashPlayerBio = `https://stats.nba.com/stats/leaguedashplayerbiostats?LeagueID=00&PerMode=PerGame&Season=${currentSeason}&SeasonType=Regular+Season`

    console.log("\nFetching data...")
    console.time("Response time")

    const playerStatsResponse = await fetch(LeagueDashPlayerStats, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
            "Accept-Language": "en-CA,en-US;q=0.9,en;q=0.8",
            Referer: "https://www.nba.com/",
        },
    }).then((res) => res.json())
    const playerBiosResponse = await fetch(LeagueDashPlayerBio, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
            "Accept-Language": "en-CA,en-US;q=0.9,en;q=0.8",
            Referer: "https://www.nba.com/",
        },
    }).then((res) => res.json())

    console.timeEnd("Response time")

    // filter for players that are i) Top 100 in points  ii) Top 75 in assists  iii) Top 50 in rebounds
    const leagueStats = playerStatsResponse.resultSets[0].rowSet
    const leagueBios = playerBiosResponse.resultSets[0].rowSet
    const PTS = 60
    const AST = 53
    const REB = 52
    let totalPlayers = 0
    let players = []

    console.log("\nProcessing data...")

    for (player in leagueStats) {
        if (
            leagueStats[player][PTS] <= 100 ||
            leagueStats[player][AST] <= 75 ||
            leagueStats[player][REB] <= 50
        ) {
            // structure entries as objects
            let playerObj = {}
            playerObj.name = leagueBios[player][1]
            playerObj.personId = leagueBios[player][0]
            playerObj.teamId = leagueBios[player][2]
            playerObj.age = leagueBios[player][4]
            playerObj.height = leagueBios[player][5]
            playerObj.weight = leagueBios[player][7]
            players.push(playerObj)

            totalPlayers += 1
        }
    }

    console.log(`Total players: ${leagueStats.length}`)
    console.log(`Players filtered: ${leagueStats.length - players.length}`)
    console.log(`Remaining players: ${players.length}\n`)

    // Update players.json file with new data
    console.log("Updating file in src folder...\n")
    writeFileSync(
        "./frontend/src/players.json",
        `${JSON.stringify(players, null, 4)}`,
        "utf-8"
    )
}

setPlayers()
