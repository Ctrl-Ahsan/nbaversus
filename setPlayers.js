// This script fetches player data and prepares the players.json for NBA Versus
const { writeFileSync } = require("fs")
const fetch = require("node-fetch")

const setPlayers = async () => {
    // fetch players and stats
    const players = await fetch(
        "https://data.nba.net/data/10s/prod/v1/2022/players.json"
    ).then((res) => res.json())

    const burl =
        "https://stats.nba.com/stats/leagueLeaders?LeagueID=00&PerMode=PerGame&Season=2022-23&SeasonType=Regular%20Season&Scope=S&StatCategory="
    const points = await fetch(`${burl}PTS`).then((res) => res.json())
    const assists = await fetch(`${burl}AST`).then((res) => res.json())
    const rebounds = await fetch(`${burl}REB`).then((res) => res.json())

    // set player arrays
    const playerArray = players.league.standard
    let pointsArray = points.resultSet.rowSet
    let assistsArray = assists.resultSet.rowSet
    let reboundsArray = rebounds.resultSet.rowSet

    // set variables
    let top = []
    let stats = []
    let bad = []

    // populate "top" with players that are i) Top 100 in PTS  ii) Top 75 in assists  iii) Top 50 in rebounds
    for (let j = 0; j < 100; j++) {
        stats.push(pointsArray[j])
        top.push(pointsArray[j][0])
    }
    for (let j = 0; j < 75; j++) {
        stats.push(assistsArray[j])
        top.push(assistsArray[j][0])
    }
    for (let j = 0; j < 50; j++) {
        stats.push(reboundsArray[j])
        top.push(reboundsArray[j][0])
    }

    console.log("Total players: " + playerArray.length)
    // remove players that are not in "top"
    for (let i = 0; i < playerArray.length; i++) {
        let player = playerArray[i]

        if (!top.includes(parseInt(player.personId))) {
            bad.push(`${player.firstName} ${player.lastName}`)
            playerArray.splice(i, 1)
            i--
        }
    }

    // assign stats
    for (let i = 0; i < playerArray.length; i++) {
        let player = playerArray[i]

        for (let j = 0; j < stats.length; j++) {
            if (parseInt(player.personId) === stats[j][0]) {
                player.stats = {
                    ppg: stats[j][23],
                    apg: stats[j][19],
                    rpg: stats[j][18],
                    fgp: stats[j][9],
                    tpp: stats[j][12],
                }
            }
        }
    }
    console.log("Total players after filtering: " + playerArray.length)

    // Update players.json file with new data
    console.log("")
    console.log("Updating file in src folder")
    writeFileSync(
        "./frontend/src/players.json",
        `{
        "playersArray": ${JSON.stringify(playerArray, null, 4)}
    }`,
        "utf-8"
    )
}

setPlayers()
