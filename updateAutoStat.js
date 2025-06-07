// This script sets auto stat for NBA Versus using z-score logic
const { readFileSync, writeFileSync } = require("fs")
const path = require("path")

// Load game logs and roster
const logsPath = path.join(__dirname, "./backend/data/logs.json")
const rosterPath = path.join(__dirname, "./frontend/src/roster.json")

const logsObj = require(logsPath)
const roster = require(rosterPath)

// Define stat indices in the game logs
const statIndices = {
    pts: 31,
    reb: 23,
    ast: 24,
    stl: 26,
    blk: 27,
    "3pm": 15,
}

// Collect all values per stat to compute league averages and standard deviations
const statValues = {}
for (const stat in statIndices) {
    statValues[stat] = []
}

for (const playerId in logsObj) {
    const logs = logsObj[playerId]
    for (const log of logs) {
        for (const stat in statIndices) {
            const idx = statIndices[stat]
            const val = log[idx]
            if (typeof val === "number") {
                statValues[stat].push(val)
            }
        }
    }
}

const statMeans = {}
const statStdDevs = {}
for (const stat in statValues) {
    const values = statValues[stat]
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance =
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        values.length
    const stdDev = Math.sqrt(variance)
    statMeans[stat] = mean
    statStdDevs[stat] = stdDev
}

const getAverage = (logs, extractor) => {
    const total = logs.reduce((sum, log) => sum + extractor(log), 0)
    return total / logs.length
}

const getHitRate = (logs, extractor, threshold) => {
    const hits = logs.filter((log) => extractor(log) >= threshold).length
    return hits / logs.length
}

const calculateAutoStat = (logs) => {
    if (!logs || logs.length === 0) return "pts"

    const averages = {}
    const hitRates = {}

    for (const stat in statIndices) {
        const idx = statIndices[stat]
        averages[stat] = getAverage(logs, (log) => log[idx])
        hitRates[stat] = getHitRate(logs, (log) => log[idx], statMeans[stat])
    }

    let bestStat = null
    let bestScore = -Infinity

    for (const stat in averages) {
        const avg = averages[stat]
        const mean = statMeans[stat]
        const std = statStdDevs[stat] || 1 // prevent div by 0
        const z = (avg - mean) / std
        const hitRate = hitRates[stat]
        const score = z * hitRate

        if (score > bestScore) {
            bestStat = stat
            bestScore = score
        }
    }

    return bestStat
}

console.log("Calculating auto stats using z-scores...")

for (const player of roster.allPlayers) {
    const logs = logsObj[player.personId]
    const bestStat = calculateAutoStat(logs)
    player.autoStat = bestStat
}

writeFileSync(rosterPath, JSON.stringify(roster, null, 4), "utf-8")

console.log("Auto stats added to roster.json")
