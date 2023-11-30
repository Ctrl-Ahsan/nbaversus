const asyncHandler = require("express-async-handler")
const Players = require("../players.json")
const Stats = require("../stats.json")

const ID = 0
const NAME = 1
const GP = 6
const MIN = 10
const FG_PCT = 13
const FG3M = 14
const FG3_PCT = 16
const FT_PCT = 19
const REB = 22
const AST = 23
const TOV = 24
const STL = 25
const BLK = 26
const PF = 28
const PFD = 29
const PTS = 30
const PLUS_MINUS = 31
const GP_RANK = 36
const MIN_RANK = 40
const FG_PCT_RANK = 43
const FG3M_RANK = 44
const FG3_PCT_RANK = 46
const FT_PCT_RANK = 49
const REB_RANK = 52
const AST_RANK = 53
const TOV_RANK = 54
const STL_RANK = 55
const BLK_RANK = 56
const PF_RANK = 58
const PFD_RANK = 59
const PTS_RANK = 60
const PLUS_MINUS_RANK = 61

const getSeasonStats = asyncHandler(async (req, res) => {
    let response = {}

    try {
        // validate request
        if (!req.body.ids) {
            res.status(400).json("Please include player ID(s)")
            return
        }
        const ids = req.body.ids

        // get stats for the requested players
        for (player of Stats) {
            if (ids.includes(player[ID])) {
                response[player[ID]] = {
                    Name: player[NAME],
                    GP: player[GP],
                    MIN: player[MIN],
                    FG_PCT: player[FG_PCT],
                    FG3_PCT: player[FG3_PCT],
                    FT_PCT: player[FT_PCT],
                    REB: player[REB],
                    AST: player[AST],
                    TOV: player[TOV],
                    STL: player[STL],
                    BLK: player[BLK],
                    PF: player[PF],
                    PFD: player[PFD],
                    PTS: player[PTS],
                    PLUS_MINUS: player[PLUS_MINUS],
                    GP_RANK: player[GP_RANK],
                    MIN_RANK: player[MIN_RANK],
                    FG_PCT_RANK: player[FG_PCT_RANK],
                    FG3_PCT_RANK: player[FG3_PCT_RANK],
                    FT_PCT_RANK: player[FT_PCT_RANK],
                    REB_RANK: player[REB_RANK],
                    AST_RANK: player[AST_RANK],
                    TOV_RANK: player[TOV_RANK],
                    STL_RANK: player[STL_RANK],
                    BLK_RANK: player[BLK_RANK],
                    PF_RANK: player[PF_RANK],
                    PFD_RANK: player[PFD_RANK],
                    PTS_RANK: player[PTS_RANK],
                    PLUS_MINUS_RANK: player[PLUS_MINUS_RANK],
                }
            }
        }
    } catch (error) {
        console.error(error)
        res.status(500).json("Could not fetch stats")
    }
    res.status(200).json(response)
})

const getCareerStats = asyncHandler(async (req, res) => {
    let response = {}

    try {
        // validate request
        if (!req.body.id) {
            res.status(400).json("Please include player ID")
            return
        }
        const id = req.body.id

        // get career stats for requested player
        for (player of Players) {
            if (player.personId === id) response = player.stats
        }
    } catch (error) {
        console.error(error)
        res.status(500).json("Could not fetch stats")
    }
    res.status(200).json(response)
})

const getGameLogs = asyncHandler(async (req, res) => {
    let response = {}

    try {
        // validate request
        if (!req.body.id || !req.body.stat) {
            res.status(400).json("Invalid request")
            return
        }
        const id = req.body.id
        console.log(id)
        const stat = req.body.stat

        // get game logs for requested player
        let games
        for (player of Players) {
            if (player.personId == id) {
                games = player.games
                break
            }
        }

        // get game logs for targeted stat
        let gameLogs = []
        switch (stat) {
            case "pts":
                for (gameIndex in games) {
                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat: games[gameIndex][PTS + 1],
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "reb":
                for (gameIndex in games) {
                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat: games[gameIndex][REB + 1],
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "ast":
                for (gameIndex in games) {
                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat: games[gameIndex][AST + 1],
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "stl":
                for (gameIndex in games) {
                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat: games[gameIndex][STL + 1],
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "blk":
                for (gameIndex in games) {
                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat: games[gameIndex][BLK + 1],
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "tov":
                for (gameIndex in games) {
                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat: games[gameIndex][TOV + 1],
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "3pm":
                for (gameIndex in games) {
                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat: games[gameIndex][15],
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "pts+reb":
                for (gameIndex in games) {
                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat:
                            games[gameIndex][PTS + 1] +
                            games[gameIndex][REB + 1],
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "pts+ast":
                for (gameIndex in games) {
                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat:
                            games[gameIndex][PTS + 1] +
                            games[gameIndex][AST + 1],
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "ast+reb":
                for (gameIndex in games) {
                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat:
                            games[gameIndex][AST + 1] +
                            games[gameIndex][REB + 1],
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "pts+reb+ast":
                for (gameIndex in games) {
                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat:
                            games[gameIndex][PTS + 1] +
                            games[gameIndex][REB + 1] +
                            games[gameIndex][AST + 1],
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "stl+blk":
                for (gameIndex in games) {
                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat:
                            games[gameIndex][STL + 1] +
                            games[gameIndex][BLK + 1],
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "dd":
                for (gameIndex in games) {
                    // check whether two highest stats are in the double digits
                    let stats = []
                    let doubleDouble = false
                    stats.push(games[gameIndex][PTS + 1])
                    stats.push(games[gameIndex][REB + 1])
                    stats.push(games[gameIndex][AST + 1])
                    stats.push(games[gameIndex][STL + 1])
                    stats.push(games[gameIndex][BLK + 1])
                    stats.sort((a, b) => b - a)

                    if (stats[0] >= 10 && stats[1] >= 10) doubleDouble = true

                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat: doubleDouble,
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            case "td":
                for (gameIndex in games) {
                    // check whether two highest stats are in the double digits
                    let stats = []
                    let tripleDouble = false
                    stats.push(games[gameIndex][PTS + 1])
                    stats.push(games[gameIndex][REB + 1])
                    stats.push(games[gameIndex][AST + 1])
                    stats.push(games[gameIndex][STL + 1])
                    stats.push(games[gameIndex][BLK + 1])
                    stats.sort((a, b) => b - a)

                    if (stats[0] >= 10 && stats[1] >= 10 && stats[2] >= 10)
                        tripleDouble = true

                    let simpleGameLog = {
                        id: games[gameIndex][7],
                        date: games[gameIndex][8],
                        matchup: games[gameIndex][9],
                        stat: tripleDouble,
                    }
                    gameLogs.push(simpleGameLog)
                }

                res.status(200).json(gameLogs)
                break

            default:
                res.json("default")
                break
        }
    } catch (error) {
        console.error(error)
        res.status(500).json("Could not fetch game logs")
    }
})

const getLeaders = asyncHandler(async (req, res) => {
    let response = {}

    try {
        // get daily leaders
        let latestDate = ""
        let dailyPoints = []
        let dailyRebounds = []
        let dailyAssists = []
        let dailySteals = []
        let dailyBlocks = []
        let dailyThrees = []

        for (player of Players) {
            // only count latest games
            if (player.games[0][8] > latestDate) {
                latestDate = player.games[0][8]
                dailyPoints = []
                dailyRebounds = []
                dailyAssists = []
                dailySteals = []
                dailyBlocks = []
                dailyThrees = []
            } else {
                dailyPoints.push([
                    player.personId,
                    player.name,
                    player.games[0][PTS + 1],
                ])
                dailyRebounds.push([
                    player.personId,
                    player.name,
                    player.games[0][REB + 1],
                ])
                dailyAssists.push([
                    player.personId,
                    player.name,
                    player.games[0][AST + 1],
                ])
                dailySteals.push([
                    player.personId,
                    player.name,
                    player.games[0][STL + 1],
                ])
                dailyBlocks.push([
                    player.personId,
                    player.name,
                    player.games[0][BLK + 1],
                ])
                dailyThrees.push([
                    player.personId,
                    player.name,
                    player.games[0][15],
                ])
            }
        }

        // sort and structure
        dailyPoints.sort((a, b) => b[2] - a[2])
        dailyRebounds.sort((a, b) => b[2] - a[2])
        dailyAssists.sort((a, b) => b[2] - a[2])
        dailySteals.sort((a, b) => b[2] - a[2])
        dailyBlocks.sort((a, b) => b[2] - a[2])
        dailyThrees.sort((a, b) => b[2] - a[2])

        dailyPoints.length = 5
        dailyRebounds.length = 5
        dailyAssists.length = 5
        dailySteals.length = 5
        dailyBlocks.length = 5
        dailyThrees.length = 5

        const dailyLeaders = {
            points: dailyPoints,
            rebounds: dailyRebounds,
            assists: dailyAssists,
            steals: dailySteals,
            blocks: dailyBlocks,
            threes: dailyThrees,
        }

        // get season leaders
        let seasonPoints = []
        let seasonRebounds = []
        let seasonAssists = []
        let seasonSteals = []
        let seasonBlocks = []
        let seasonThrees = []

        for (player of Stats) {
            if (player[PTS_RANK] <= 5)
                seasonPoints.push([player[ID], player[NAME], player[PTS]])
            if (player[REB_RANK] <= 5)
                seasonRebounds.push([player[ID], player[NAME], player[REB]])
            if (player[AST_RANK] <= 5)
                seasonAssists.push([player[ID], player[NAME], player[AST]])
            if (player[STL_RANK] <= 5)
                seasonSteals.push([player[ID], player[NAME], player[STL]])
            if (player[BLK_RANK] <= 5)
                seasonBlocks.push([player[ID], player[NAME], player[BLK]])
            if (player[FG3M_RANK] <= 5)
                seasonThrees.push([player[ID], player[NAME], player[FG3M]])
        }

        // sort and structure
        seasonPoints.sort((a, b) => b[2] - a[2])
        seasonRebounds.sort((a, b) => b[2] - a[2])
        seasonAssists.sort((a, b) => b[2] - a[2])
        seasonSteals.sort((a, b) => b[2] - a[2])
        seasonBlocks.sort((a, b) => b[2] - a[2])
        seasonThrees.sort((a, b) => b[2] - a[2])

        const seasonLeaders = {
            points: seasonPoints,
            rebounds: seasonRebounds,
            assists: seasonAssists,
            steals: seasonSteals,
            blocks: seasonBlocks,
            threes: seasonThrees,
        }

        response = { daily: dailyLeaders, season: seasonLeaders }
    } catch (error) {
        console.error(error)
        res.status(500).json("Could not fetch stats")
    }
    res.status(200).json(response)
})

module.exports = {
    getSeasonStats,
    getCareerStats,
    getGameLogs,
    getLeaders,
}
