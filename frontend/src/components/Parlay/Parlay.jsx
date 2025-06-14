import "./Parlay.css"
import { useContext } from "react"
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

import { AppContext } from "../../AppContext"

import { IoPersonAdd, IoLockClosed } from "react-icons/io5"
import {
    IoIosRemoveCircleOutline,
    IoIosAddCircle,
    IoIosRemoveCircle,
} from "react-icons/io"
import Analyzer from "./Analyzer"
import { useNavigate } from "react-router-dom"

const Parlay = () => {
    const { lines, setLines, parlayScope, setParlayScope, filters, isPremium } =
        useContext(AppContext)
    const navigate = useNavigate()
    const {
        minutesMin,
        minutesMax,
        home,
        away,
        win,
        loss,
        excludeBlowoutWins,
        excludeBlowoutLosses,
    } = filters

    const applyFilters = (logs) => {
        return logs.filter((log) => {
            // Minutes Played
            if (
                (minutesMin !== null && log.minutes < minutesMin) ||
                (minutesMax !== null && log.minutes > minutesMax)
            )
                return false

            // Location (Home/Away)
            if ((log.isHome && !home) || (!log.isHome && !away)) return false

            // Outcome (Win/Loss)
            if ((log.result === "W" && !win) || (log.result === "L" && !loss))
                return false

            // Blowouts
            const scoreDiff = Math.abs(log.teamScore - log.opponentScore)
            if (
                (excludeBlowoutWins && log.result === "W" && scoreDiff >= 20) ||
                (excludeBlowoutLosses && log.result === "L" && scoreDiff >= 20)
            )
                return false

            return true
        })
    }

    const calculateHitRate = () => {
        let totalRate = 0
        let count = 0

        lines.forEach((line) => {
            let relevantLogs

            if (parlayScope === "p") {
                relevantLogs = line.logs.filter((log) => log.isPlayoffs)
            } else if (parlayScope === "s") {
                relevantLogs = line.logs.filter((log) => !log.isPlayoffs)
            } else {
                const timeSpan =
                    parlayScope === "l5"
                        ? 5
                        : parlayScope === "l10"
                        ? 10
                        : parlayScope === "l20"
                        ? 20
                        : line.logs.length
                relevantLogs = line.logs.slice(0, timeSpan)
            }

            relevantLogs = applyFilters(relevantLogs)

            if (relevantLogs.length === 0) return

            const isCategorical = line.stat === "dd" || line.stat === "td"

            let hit = 0

            if (line.operator === "over") {
                relevantLogs.forEach((entry) => {
                    if (isCategorical) {
                        if (entry.stat) hit++
                    } else if (
                        typeof entry.stat === "number" &&
                        entry.stat > line.value
                    ) {
                        hit++
                    }
                })
            } else if (line.operator === "under") {
                relevantLogs.forEach((entry) => {
                    if (isCategorical) {
                        if (!entry.stat) hit++
                    } else if (
                        typeof entry.stat === "number" &&
                        entry.stat < line.value
                    ) {
                        hit++
                    }
                })
            }

            const hitRate = hit / relevantLogs.length
            totalRate += hitRate
            count++
        })

        if (count === 0) return 0

        return (totalRate * 100) / count
    }

    const getHitRateColor = (hitRate) => {
        if (hitRate >= 75) {
            return "#76f660ba" // Green
        } else if (hitRate >= 50) {
            return "#ffff61b8"
        } else {
            return "#ff6c6cc1" // Red
        }
    }

    const calculateWeightedAverageEdge = () => {
        let weightedSum = 0
        let totalLogs = 0

        lines.forEach((line) => {
            if (line.stat === "dd" || line.stat === "td") return

            const timeSpan =
                parlayScope === "l5"
                    ? 5
                    : parlayScope === "l10"
                    ? 10
                    : parlayScope === "l20"
                    ? 20
                    : line.logs.length

            let relevantLogs =
                parlayScope === "p"
                    ? line.logs.filter((log) => log.isPlayoffs)
                    : parlayScope === "s"
                    ? line.logs.filter((log) => !log.isPlayoffs)
                    : line.logs.slice(0, timeSpan)

            relevantLogs = applyFilters(relevantLogs)

            const stats = relevantLogs
                .map((entry) => entry.stat)
                .filter((stat) => typeof stat === "number")

            if (stats.length === 0) return

            const avg =
                stats.reduce((acc, curr) => acc + curr, 0) / stats.length

            let diff = ((avg - line.value) / line.value) * 100
            if (line.operator === "under") diff *= -1

            weightedSum += diff * stats.length
            totalLogs += stats.length
        })

        return totalLogs > 0 ? weightedSum / totalLogs : 0
    }

    const getEdgeColor = (edge) => {
        if (edge >= 25) {
            return "#76f660ba" // Green
        } else if (edge >= 10) {
            return "#ffff61b8" // Yellow
        } else {
            return "#ff6c6cc1" // Red
        }
    }

    const Line = (props) => {
        let hit = 0
        const total = props.line.logs.length
        let relevantLogs

        if (parlayScope === "p") {
            relevantLogs = props.line.logs.filter((log) => log.isPlayoffs)
        } else if (parlayScope === "s") {
            relevantLogs = props.line.logs.filter((log) => !log.isPlayoffs)
        } else {
            const timeSpan =
                parlayScope === "l5"
                    ? 5
                    : parlayScope === "l10"
                    ? 10
                    : parlayScope === "l20"
                    ? 20
                    : total

            relevantLogs = props.line.logs.slice(0, timeSpan)
        }
        relevantLogs = applyFilters(relevantLogs)

        // Determine if the stat is categorical
        const isCategorical =
            props.line.stat === "dd" || props.line.stat === "td"

        // Iterate through game logs and tally up passing records
        if (props.line.operator === "over") {
            relevantLogs.forEach((entry) => {
                if (isCategorical) {
                    if (entry.stat) hit++
                } else if (
                    typeof entry.stat === "number" &&
                    entry.stat > props.line.value
                ) {
                    hit++
                }
            })
        } else if (props.line.operator === "under") {
            relevantLogs.forEach((entry) => {
                if (isCategorical) {
                    if (!entry.stat) hit++
                } else if (
                    typeof entry.stat === "number" &&
                    entry.stat < props.line.value
                ) {
                    hit++
                }
            })
        }

        // Calculate Hit Percentage
        const hitPercentage =
            relevantLogs.length > 0 ? hit / relevantLogs.length : 0
        let color = "#fff"
        if (hitPercentage >= 0.75) {
            color = "#23db02" // Green
        } else if (hitPercentage >= 0.5) {
            color = "#e9d734" // Yellow
        } else {
            color = "#c90808" // Red
        }

        // Line functions
        const incrementValue = () => {
            if (props.line.value < 99) {
                const updatedLines = lines.map((line) =>
                    JSON.stringify(line) === JSON.stringify(props.line)
                        ? { ...line, value: parseFloat(line.value) + 1 } // Ensure value is a number
                        : line
                )
                setLines(updatedLines)
            }
        }
        const decrementValue = () => {
            if (props.line.value > 1) {
                const updatedLines = lines.map((line) =>
                    JSON.stringify(line) === JSON.stringify(props.line)
                        ? { ...line, value: parseFloat(line.value) - 1 } // Ensure value is a number
                        : line
                )
                setLines(updatedLines)
            }
        }
        const removeLine = () => {
            const updatedLines = lines.filter(
                (existingLine) =>
                    JSON.stringify(existingLine) !== JSON.stringify(props.line)
            )
            setLines(updatedLines)
        }

        // Determine the caption based on the stat
        let caption = ""
        switch (props.line.stat) {
            case "pts":
                caption = "POINTS"
                break
            case "reb":
                caption = "REBOUNDS"
                break
            case "ast":
                caption = "ASSISTS"
                break
            case "stl":
                caption = "STEALS"
                break
            case "blk":
                caption = "BLOCKS"
                break
            case "tov":
                caption = "TURNOVERS"
                break
            case "3pm":
                caption = "THREES MADE"
                break
            case "pts+reb":
                caption = "POINTS AND REBOUNDS"
                break
            case "pts+ast":
                caption = "POINTS AND ASSISTS"
                break
            case "ast+reb":
                caption = "ASSISTS AND REBOUNDS"
                break
            case "pts+reb+ast":
                caption = "POINTS, REBOUNDS AND ASSISTS"
                break
            case "stl+blk":
                caption = "STEALS AND BLOCKS"
                break
            case "dd":
                caption = "DOUBLE DOUBLE"
                break
            case "td":
                caption = "TRIPLE DOUBLE"
                break
            default:
                caption = "STAT"
                break
        }

        // Calculate High, Low, and Average with validations
        let high, low, average
        if (isCategorical) {
            const yesCount = relevantLogs.filter((entry) => entry.stat).length
            const noCount = relevantLogs.length - yesCount
            const averagePercentage =
                relevantLogs.length > 0 && yesCount > 0
                    ? (yesCount / relevantLogs.length).toFixed(2) // Assuming percentage
                    : "0.0"

            high = yesCount // Maximum possible
            low = noCount // Minimum possible
            average = averagePercentage // Percentage of YES
        } else {
            const stats = relevantLogs
                .map((entry) => entry.stat)
                .filter((stat) => typeof stat === "number")
            if (stats.length > 0) {
                high = Math.max(...stats)
                low = Math.min(...stats)
                const sum = stats.reduce((acc, curr) => acc + curr, 0)
                average = (sum / stats.length).toFixed(1)
            } else {
                high = "N/A"
                low = "N/A"
                average = "0.0"
            }
        }

        // Define intelligent thresholds for differentials
        const differentialThresholds = {
            pts: 5,
            reb: 3,
            ast: 3,
            stl: 2,
            blk: 2,
            tov: 2,
            "3pm": 2,
            "pts+reb": 8,
            "pts+ast": 8,
            "ast+reb": 6,
            "pts+reb+ast": 11,
            "stl+blk": 4,
        }

        // Helper function to determine the color class based on differential
        const getColorClass = (diff, stat, operator, lineValue) => {
            if (diff === null) return ""
            if (operator === "under") diff *= -1
            if (diff < 0) return "red"

            const rawThreshold = differentialThresholds[stat] || 10 // fallback if stat not listed

            // Convert raw threshold to percentage threshold
            const percentageThreshold = (rawThreshold / lineValue) * 100

            if (diff >= percentageThreshold) return "green"
            return "yellow"
        }

        // Helper function to format differential with plus/minus and round to 1 decimal
        const formatDifferential = (diff) => {
            if (diff === null) return ""
            const fixedDiff = diff.toFixed(1)
            return diff >= 0 ? `+${fixedDiff}%` : `${fixedDiff}%`
        }

        // Calculate percentage differentials for High, Low, and Average
        let highDiff = isCategorical
            ? null
            : ((high - props.line.value) / props.line.value) * 100

        let lowDiff = isCategorical
            ? null
            : ((low - props.line.value) / props.line.value) * 100

        let averageDiff = isCategorical
            ? null
            : ((parseFloat(average) - props.line.value) / props.line.value) *
              100

        return (
            <div className="line">
                <div className="left">
                    <div className="remove" onClick={removeLine}>
                        <IoIosRemoveCircleOutline />
                    </div>
                    <div className="info">
                        <div className="name">{props.line.player.name}</div>
                        <div className="stat">{caption}</div>
                        <div className="value">
                            {props.line.stat !== "dd" &&
                            props.line.stat !== "td" ? (
                                <>
                                    {props.line.operator.toUpperCase()}{" "}
                                    <span className="adjust-buttons">
                                        <IoIosRemoveCircle
                                            className={
                                                props.line.value < 1
                                                    ? "disabled"
                                                    : ""
                                            }
                                            onClick={decrementValue}
                                        />
                                        <span className="line-value">
                                            {props.line.value}
                                        </span>
                                        <IoIosAddCircle
                                            className={
                                                props.line.value > 99
                                                    ? "disabled"
                                                    : ""
                                            }
                                            onClick={incrementValue}
                                        />
                                    </span>
                                </>
                            ) : props.line.operator === "over" ? (
                                "YES"
                            ) : (
                                "NO"
                            )}
                        </div>
                    </div>
                </div>
                {!isCategorical && (
                    <div className="right">
                        <div className="summary">
                            <div title="High">
                                H: {high}{" "}
                                {high !== "N/A" && (
                                    <span
                                        className={getColorClass(
                                            parseFloat(highDiff),
                                            props.line.stat,
                                            props.line.operator,
                                            props.line.value
                                        )}
                                    >
                                        (
                                        {formatDifferential(
                                            parseFloat(highDiff)
                                        )}
                                        )
                                    </span>
                                )}
                            </div>
                            <div title="Low">
                                L: {low}{" "}
                                {low !== "N/A" && (
                                    <span
                                        className={getColorClass(
                                            parseFloat(lowDiff),
                                            props.line.stat,
                                            props.line.operator,
                                            props.line.value
                                        )}
                                    >
                                        (
                                        {formatDifferential(
                                            parseFloat(lowDiff)
                                        )}
                                        )
                                    </span>
                                )}
                            </div>
                            <div title="Average">
                                A: {average}{" "}
                                {average !== "0.0" && (
                                    <span
                                        className={getColorClass(
                                            parseFloat(averageDiff),
                                            props.line.stat,
                                            props.line.operator,
                                            props.line.value
                                        )}
                                    >
                                        (
                                        {formatDifferential(
                                            parseFloat(averageDiff)
                                        )}
                                        )
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="indicator">
                            <CircularProgressbarWithChildren
                                value={hit}
                                maxValue={relevantLogs.length}
                                background
                                styles={buildStyles({
                                    backgroundColor: "rgba(0, 0, 0, 0)",
                                    textColor: "#fff",
                                    pathColor: color,
                                    trailColor: "#00000045",
                                })}
                            >
                                <span
                                    style={{
                                        fontSize: "0.8em",
                                        fontWeight: 700,
                                    }}
                                >
                                    {hit} / {relevantLogs.length}
                                </span>
                            </CircularProgressbarWithChildren>
                        </div>
                    </div>
                )}
                {isCategorical && (
                    <div className="right">
                        <div className="summary">
                            <div title="Yes">Y: {hit}</div>
                            <div title="No">N: {relevantLogs.length - hit}</div>
                            <div title="Average">A: {average}</div>
                        </div>
                        <div className="indicator">
                            <CircularProgressbarWithChildren
                                value={hit}
                                maxValue={relevantLogs.length}
                                background
                                styles={buildStyles({
                                    backgroundColor: "rgba(0, 0, 0, 0)",
                                    textColor: "#fff",
                                    pathColor: color,
                                    trailColor: "#00000045",
                                })}
                            >
                                <span
                                    style={{
                                        fontSize: "0.8em",
                                        fontWeight: 700,
                                    }}
                                >
                                    {hit} / {relevantLogs.length}
                                </span>
                            </CircularProgressbarWithChildren>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <main className="parlay-container">
            <Analyzer />

            {lines.length === 0 && (
                <div className="message-container">
                    <div className="message">
                        <div>
                            <IoPersonAdd fontSize={"4em"} />
                        </div>
                        Add player props to analyze
                    </div>
                </div>
            )}
            {lines.length > 0 && (
                <div className="parlay">
                    <div className="header">
                        <div className="scope">
                            <div
                                className={
                                    parlayScope === "l5"
                                        ? "scope-item active"
                                        : "scope-item"
                                }
                                onClick={() => setParlayScope("l5")}
                            >
                                L5
                            </div>
                            <div
                                className={
                                    parlayScope === "l10"
                                        ? "scope-item active"
                                        : "scope-item"
                                }
                                onClick={() => setParlayScope("l10")}
                            >
                                L10
                            </div>
                            <div
                                className={
                                    parlayScope === "l20"
                                        ? "scope-item active"
                                        : "scope-item"
                                }
                                onClick={() => setParlayScope("l20")}
                            >
                                L20
                            </div>
                            <div
                                className={
                                    parlayScope === "s"
                                        ? "scope-item active"
                                        : "scope-item"
                                }
                                onClick={() => setParlayScope("s")}
                            >
                                Season
                            </div>
                            <div
                                className={
                                    parlayScope === "p"
                                        ? "scope-item active"
                                        : "scope-item"
                                }
                                onClick={() => setParlayScope("p")}
                            >
                                Playoffs
                            </div>
                        </div>
                        <div className="hit-rate-summary">
                            {lines.length}{" "}
                            {lines.length === 1 ? "Line" : "Lines"} |{" "}
                            <span
                                style={{
                                    color: getHitRateColor(calculateHitRate()),
                                }}
                            >
                                {calculateHitRate().toFixed(1)}%
                            </span>{" "}
                            Hit Rate |{" "}
                            {isPremium ? (
                                <span
                                    style={{
                                        color: getEdgeColor(
                                            calculateWeightedAverageEdge()
                                        ),
                                    }}
                                >
                                    {calculateWeightedAverageEdge().toFixed(1)}%
                                </span>
                            ) : (
                                <span
                                    className="locked-edge"
                                    onClick={() => navigate("/account/premium")}
                                >
                                    <IoLockClosed
                                        style={{
                                            verticalAlign: "middle",
                                            fontSize: "0.9em",
                                            cursor: "pointer",
                                        }}
                                    />
                                    {"  "}
                                </span>
                            )}{" "}
                            <span style={{ verticalAlign: "middle" }}>
                                Edge
                            </span>
                        </div>
                    </div>
                    <div className="lines">
                        {lines.length > 0 &&
                            lines.map((item, index) => (
                                <Line key={index} line={item} />
                            ))}
                    </div>
                </div>
            )}
        </main>
    )
}

export default Parlay
