const asyncHandler = require("express-async-handler")
const fetch = require("node-fetch")
const Players = require("../players.json")
const LeagueStats = require("../league.json")

const ID = 0
const NAME = 1
const GP = 6
const MIN = 10
const FG_PCT = 13
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

const LeagueDashPlayerStats =
    "https://stats.nba.com/stats/leaguedashplayerstats?LastNGames=0&LeagueID=00&MeasureType=Base&Month=0&OpponentTeamID=0&PORound=0&PerMode=PerGame&Period=0&PlusMinus=N&Rank=N&Season=2022-23&SeasonType=Regular%20Season&TeamID=0"

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
        for (player of LeagueStats) {
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

module.exports = {
    getSeasonStats,
    getCareerStats,
}
