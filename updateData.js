// This script fetches player data and prepares the players.json for NBA Versus
const { writeFileSync } = require("fs")
const fetch = require("node-fetch")
const logUpdate = require("log-update")

const setPlayers = async () => {
    // fetch league data
    const currentSeason = "2023-24" // must change every season
    const LeagueDashPlayerStats = `https://stats.nba.com/stats/leaguedashplayerstats?LastNGames=0&LeagueID=00&MeasureType=Base&Month=0&OpponentTeamID=0&PORound=0&PerMode=PerGame&Period=0&PlusMinus=N&Rank=N&Season=${currentSeason}&SeasonType=Regular%20Season&TeamID=0&Weight=`
    const LeagueDashPlayerBio = `https://stats.nba.com/stats/leaguedashplayerbiostats?LeagueID=00&PerMode=PerGame&Season=${currentSeason}&SeasonType=Regular+Season`
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

    console.timeEnd("Response time")

    // fetch stats and structure response
    const PlayerCareerStats =
        "https://stats.nba.com/stats/playercareerstats?LeagueID=&PerMode=PerGame&PlayerID="
    const leagueStats = leagueStatsResponse.resultSets[0].rowSet
    const leagueBios = leagueBiosResponse.resultSets[0].rowSet
    const gameLogs = gameLogsResponse.resultSets[0].rowSet
    const NAME = 1
    const ID = 0
    const TEAMID = 2
    const AGE = 4
    const HEIGHT = 5
    const WEIGHT = 7
    const PTS_RANK = 60
    const AST_RANK = 53
    const REB_RANK = 52
    let allPlayers = []
    let filteredPlayers = []
    let allPlayersComplete = []

    console.log("\nFetching player stats...")
    console.time("Response time")

    for (player in leagueStats) {
        // console log
        const index = parseInt(player) + 1
        logUpdate(
            `Working on player ${index} of ${leagueStats.length} (${leagueStats[player][NAME]})`
        )
        // filter for players that are i) Top 100 in points  ii) Top 75 in assists  iii) Top 50 in rebounds
        if (
            leagueStats[player][PTS_RANK] <= 75 ||
            leagueStats[player][AST_RANK] <= 50 ||
            leagueStats[player][REB_RANK] <= 25
        ) {
            // structure entry as object for filteredPlayers
            let playerObj = {}
            playerObj.name = leagueBios[player][NAME]
            playerObj.personId = leagueBios[player][ID]
            playerObj.teamId = leagueBios[player][TEAMID]
            playerObj.age = leagueBios[player][AGE]
            playerObj.height =
                leagueBios[player][HEIGHT].replace("-", "'") + '"'
            playerObj.weight = leagueBios[player][WEIGHT]
            filteredPlayers.push(playerObj)
        }

        // fetch career stats
        const playerCareerStats = await fetch(
            `${PlayerCareerStats}${leagueBios[player][ID]}`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
                    "Accept-Language": "en-CA,en-US;q=0.9,en;q=0.8",
                    Referer: "https://www.nba.com/",
                },
            }
        ).then((res) => res.json())

        // remove multiple stats entries for same season (players traded mid-season)
        playerCareerStats.resultSets[0].rowSet =
            playerCareerStats.resultSets[0].rowSet.filter(
                (item, index, self) => {
                    if (index < self.length - 1)
                        return item[1] !== self[index + 1][1]
                    else return true
                }
            )

        // reverse season order to descending
        playerCareerStats.resultSets[0].rowSet.reverse()
        playerCareerStats.resultSets[2].rowSet.reverse()
        playerCareerStats.resultSets[10].rowSet.reverse()
        playerCareerStats.resultSets[11].rowSet.reverse()

        // structure entry as object for allPlayers
        let playerObj = {}
        playerObj.id = player
        playerObj.name = leagueBios[player][NAME]
        playerObj.personId = leagueBios[player][ID]
        playerObj.teamId = leagueBios[player][TEAMID]
        playerObj.age = leagueBios[player][AGE]
        playerObj.height = leagueBios[player][HEIGHT].replace("-", "'") + '"'
        playerObj.weight = leagueBios[player][WEIGHT]
        allPlayers.push(playerObj)

        // structure entry as object for allPlayersComplete
        let playerObjComplete = {}
        playerObjComplete.id = player
        playerObjComplete.name = leagueBios[player][NAME]
        playerObjComplete.personId = leagueBios[player][ID]
        playerObjComplete.teamId = leagueBios[player][TEAMID]
        playerObjComplete.age = leagueBios[player][AGE]
        playerObjComplete.height =
            leagueBios[player][HEIGHT].replace("-", "'") + '"'
        playerObjComplete.weight = leagueBios[player][WEIGHT]
        playerObjComplete.stats = playerCareerStats.resultSets
        playerObjComplete.games = (() => {
            let games = []
            for (log of gameLogs) {
                if (log[1] === leagueBios[player][ID]) {
                    games.push(log)
                }
            }
            return games
        })()
        allPlayersComplete.push(playerObjComplete)
    }
    logUpdate.clear()
    console.timeEnd("Response time")

    // Update players.json file with new data
    const playerArrays = {
        allPlayers: allPlayers,
        filteredPlayers: filteredPlayers,
    }
    console.log("\nUpdating project files...")
    writeFileSync(
        "./frontend/src/players.json",
        `${JSON.stringify(playerArrays, null, 4)}`,
        "utf-8"
    )
    writeFileSync(
        "./backend/players.json",
        `${JSON.stringify(allPlayersComplete, null, 4)}`,
        "utf-8"
    )
    writeFileSync(
        "./backend/stats.json",
        `${JSON.stringify(leagueStats, null, 4)}`,
        "utf-8"
    )
    console.log("Done!\n")

    console.log(`Total players: ${leagueStats.length}`)
    console.log(
        `Players filtered: ${leagueStats.length - filteredPlayers.length}`
    )
    console.log(`Remaining players: ${filteredPlayers.length}\n`)
}

setPlayers()
