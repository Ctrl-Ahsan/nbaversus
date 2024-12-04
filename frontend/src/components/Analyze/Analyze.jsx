import "./Analyze.css"
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
import roster from "../../players.json"

import { IoPersonAdd } from "react-icons/io5"
import { IoIosRemoveCircleOutline } from "react-icons/io"
import { FaPlus } from "react-icons/fa"

const Analyze = () => {
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
            // validate line
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
            // fetch game data
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
        let total = props.line.logs.length
        let color = "#fff"
        let timeSpan =
            parlayScope === "l5"
                ? 5
                : parlayScope === "l10"
                ? 10
                : parlayScope === "l20"
                ? 20
                : total

        // iterate through game logs and tally up passing records
        if (props.line.operator === "over") {
            let index = 0
            for (let entry of props.line.logs) {
                if (index >= timeSpan) break
                if (props.line.stat === "dd" || props.line.stat === "td") {
                    if (entry.stat) hit++
                } else if (entry.stat > props.line.value) hit++
                index++
            }
        } else if (props.line.operator === "under") {
            let index = 0
            for (let entry of props.line.logs) {
                if (index >= timeSpan) break
                if (props.line.stat === "dd" || props.line.stat === "td") {
                    if (!entry.stat) hit++
                } else if (entry.stat < props.line.value) hit++
                index++
            }
        }

        let hitPercentage = timeSpan > total ? hit / total : hit / timeSpan
        hitPercentage >= 0.75
            ? (color = "rgb(35, 219, 2)")
            : hitPercentage >= 0.5
            ? (color = "#e9d734")
            : (color = "#c90808")

        const removeLine = () => {
            for (let existingLine of lines) {
                if (
                    JSON.stringify(props.line) === JSON.stringify(existingLine)
                ) {
                    let remainingLines = lines
                    remainingLines.splice(lines.indexOf(props.line), 1)
                    setLines([...remainingLines])
                }
            }
        }

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
                                ? props.line.operator.toUpperCase() +
                                  " " +
                                  props.line.value
                                : props.line.operator === "over"
                                ? "YES"
                                : "NO"}
                        </div>
                    </div>
                </div>
                <div className="indicator">
                    <CircularProgressbarWithChildren
                        value={hit}
                        maxValue={timeSpan > total ? total : timeSpan}
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
                            {hit} / {timeSpan > total ? total : timeSpan}
                        </span>
                    </CircularProgressbarWithChildren>
                </div>
            </div>
        )
    }

    return (
        <main className="analyze-container">
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
                    <div className="summary">
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
                        lines.map((item) => <Line line={item} />)}
                </div>
            )}
        </main>
    )
}

export default Analyze
