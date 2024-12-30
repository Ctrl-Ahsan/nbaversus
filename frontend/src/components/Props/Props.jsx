import "./Props.css"
import { useContext, useState } from "react"
import axios from "axios"
import { ReactSearchAutocomplete } from "react-search-autocomplete"
import { toast } from "react-toastify"
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

import { AppContext } from "../../AppContext"
import roster from "../../roster.json"

import { IoPersonAdd } from "react-icons/io5"
import { IoIosRemoveCircleOutline } from "react-icons/io"
import { FaPlus } from "react-icons/fa"

const Props = () => {
    const { lines, setLines, parlayScope, setParlayScope } =
        useContext(AppContext)
    const players = [...roster.allPlayers]

    const Builder = () => {
        const [line, setLine] = useState({
            player: {},
            stat: "pts",
            operator: "over",
            value: null,
        })
        const onChange = (e) => {
            setLine((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }

        const addLine = async () => {
            // Validate line
            if (JSON.stringify(line.player) === "{}") {
                toast.error("No player selected")
                return
            }
            if (
                (line.value > 99.5 || line.value < 0.5) &&
                line.stat !== "dd" &&
                line.stat !== "td"
            ) {
                toast.error("Value must be between 0.5 and 99.5")
                return
            }
            for (let existingLine of lines) {
                if (
                    line.player.personId === existingLine.player.personId &&
                    line.stat === existingLine.stat &&
                    line.value === existingLine.value
                ) {
                    toast.error("Line has already been added")
                    return
                }
            }
            // Fetch game data
            const gameLogsResponse = await axios
                .post("/api/stats/gamelogs", {
                    id: line.player.personId,
                    stat: line.stat,
                })
                .catch((error) => {
                    toast.error(error.response.data)
                })
            if (gameLogsResponse) {
                setLines((prev) => [
                    ...prev,
                    { ...line, logs: gameLogsResponse.data },
                ])
            }
        }

        const SearchBar = () => {
            return (
                <>
                    <div className="search">
                        <div className="search-bar">
                            <ReactSearchAutocomplete
                                items={players}
                                styling={{
                                    fontFamily: "inherit",
                                    color: "white",
                                    backgroundColor: "#333333",
                                    backdropFilter: "blur(100px)",
                                    hoverBackgroundColor: "#000000ab",
                                    border: "1px solid rgba(148, 148, 148, 0.3)",
                                }}
                                onSelect={onSelect}
                                formatResult={formatResult}
                            />
                        </div>
                    </div>
                </>
            )
        }

        const onSelect = (player) => {
            setLine((prev) => ({ ...prev, player: player }))
        }

        const formatResult = (player) => {
            if (
                roster.filteredPlayers.filter((item) => {
                    if (item.personId === player.personId) return true
                    else return false
                }).length > 0
            ) {
                return (
                    <>
                        <span
                            style={{
                                display: "block",
                                textAlign: "left",
                                fontWeight: 700,
                            }}
                        >
                            {player.name}
                        </span>
                    </>
                )
            } else {
                return (
                    <>
                        <span
                            style={{
                                display: "block",
                                textAlign: "left",
                            }}
                        >
                            {player.name}
                        </span>
                    </>
                )
            }
        }

        return (
            <div className="builder">
                <div className="items-wrapper">
                    <div className="item">
                        <div className="label">Player</div>
                        {JSON.stringify(line.player) === "{}" ? (
                            <SearchBar />
                        ) : (
                            <div
                                className="name"
                                onClick={() =>
                                    setLine((prev) => ({
                                        ...prev,
                                        player: {},
                                    }))
                                }
                            >
                                {line.player.name}
                            </div>
                        )}
                    </div>
                    <div className="item">
                        <div className="label">Stat</div>
                        <select
                            name="stat"
                            value={line.stat}
                            onChange={onChange}
                        >
                            <option value={"pts"}>Points</option>
                            <option value={"reb"}>Rebounds</option>
                            <option value={"ast"}>Assists</option>
                            <option value={"stl"}>Steals</option>
                            <option value={"blk"}>Blocks</option>
                            <option value={"tov"}>Turnovers</option>
                            <option value={"3pm"}>Threes Made</option>
                            <option value={"pts+reb"}>
                                Points and Rebounds
                            </option>
                            <option value={"pts+ast"}>
                                Points and Assists
                            </option>
                            <option value={"ast+reb"}>
                                Assists and Rebounds
                            </option>
                            <option value={"pts+reb+ast"}>
                                Points, Rebounds and Assists
                            </option>
                            <option value={"stl+blk"}>Steals and Blocks</option>
                            <option value={"dd"}>Double Double</option>
                            <option value={"td"}>Triple Double</option>
                        </select>
                    </div>
                    <div className="item" id="operator">
                        <div className="label">Value</div>
                        <div className="value">
                            <select
                                name="operator"
                                value={line.operator}
                                onChange={onChange}
                            >
                                <option value={"over"}>
                                    {line.stat !== "dd" && line.stat !== "td"
                                        ? "Over"
                                        : "Yes"}
                                </option>
                                <option value={"under"}>
                                    {line.stat !== "dd" && line.stat !== "td"
                                        ? "Under"
                                        : "No"}
                                </option>
                            </select>
                            {line.stat !== "dd" && line.stat !== "td" && (
                                <input
                                    name="value"
                                    value={line.value}
                                    onChange={onChange}
                                    type="number"
                                    min={0.5}
                                    max={999.5}
                                    step={0.5}
                                ></input>
                            )}
                        </div>
                    </div>
                </div>
                <div className="submit">
                    <button className="green" onClick={addLine}>
                        <div className="button-content">
                            <div className="content">
                                <FaPlus />
                            </div>
                            <div>Add Line</div>
                        </div>
                    </button>
                </div>
            </div>
        )
    }

    const Line = (props) => {
        let hit = 0
        const total = props.line.logs.length
        const timeSpan =
            parlayScope === "l5"
                ? 5
                : parlayScope === "l10"
                ? 10
                : parlayScope === "l20"
                ? 20
                : total

        // Determine the subset of logs based on timeSpan
        const relevantLogs = props.line.logs.slice(0, timeSpan)

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

        // Function to remove the line
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
                    ? ((yesCount / relevantLogs.length) * 100).toFixed(1) // Assuming percentage
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
        const getColorClass = (diff, stat, operator) => {
            if (diff === null) return ""
            if (operator === "under") diff *= -1
            if (diff < 0) return "red"
            const threshold = differentialThresholds[stat] || 10 // Default threshold
            console.log(operator)
            if (diff >= threshold) return "green"
            return "yellow"
        }

        // Helper function to format differential with plus/minus and round to 1 decimal
        const formatDifferential = (diff) => {
            if (diff === null) return ""
            const fixedDiff = diff.toFixed(1)
            return diff >= 0 ? `+${fixedDiff}` : `${fixedDiff}`
        }

        // Calculate differentials for High, Low, and Average
        let highDiff = isCategorical
            ? null
            : (high - props.line.value).toFixed(1)
        let lowDiff = isCategorical ? null : (low - props.line.value).toFixed(1)
        let averageDiff = isCategorical
            ? null
            : (parseFloat(average) - props.line.value).toFixed(1)

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
                            props.line.stat !== "td"
                                ? `${props.line.operator.toUpperCase()} ${
                                      props.line.value
                                  }`
                                : props.line.operator === "over"
                                ? "YES"
                                : "NO"}
                        </div>
                    </div>
                </div>
                {!isCategorical && (
                    <div className="right">
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
                        <div className="summary">
                            <div>
                                H: {high}{" "}
                                {high !== "N/A" && (
                                    <span
                                        className={getColorClass(
                                            parseFloat(highDiff),
                                            props.line.stat,
                                            props.line.operator
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
                            <div>
                                L: {low}{" "}
                                {low !== "N/A" && (
                                    <span
                                        className={getColorClass(
                                            parseFloat(lowDiff),
                                            props.line.stat,
                                            props.line.operator
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
                            <div>
                                A: {average}{" "}
                                {average !== "0.0" && (
                                    <span
                                        className={getColorClass(
                                            parseFloat(averageDiff),
                                            props.line.stat,
                                            props.line.operator
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
                    </div>
                )}
                {isCategorical && (
                    <div className="right">
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
                        <div className="summary">
                            <div>Y: {hit}</div>
                            <div>N: {relevantLogs.length - hit}</div>
                            <div>A: {average}%</div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <main className="props-container">
            <Builder />

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
                        </div>
                    </div>
                    {lines.length > 0 &&
                        lines.map((item, index) => (
                            <Line key={index} line={item} />
                        ))}
                </div>
            )}
        </main>
    )
}

export default Props
