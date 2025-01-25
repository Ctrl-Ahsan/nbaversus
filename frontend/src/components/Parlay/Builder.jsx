import { useContext, useState } from "react"
import axios from "axios"
import { ReactSearchAutocomplete } from "react-search-autocomplete"
import { toast } from "react-toastify"
import { FaPlus } from "react-icons/fa"
import roster from "../../roster.json"
import { AppContext } from "../../AppContext"
import Spinner from "../Spinner/Spinner"

const Builder = () => {
    const { lines, setLines } = useContext(AppContext)
    const players = [...roster.allPlayers]
    const [loading, setLoading] = useState(false)
    const [line, setLine] = useState({
        player: {},
        stat: "pts",
        operator: "over",
        value: 0.5,
    })

    const onChange = (e) => {
        setLine((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const addLine = async () => {
        try {
            // Validate line
            if (JSON.stringify(line.player) === "{}") {
                toast.error("No player selected")
                return
            }
            for (let existingLine of lines) {
                if (
                    line.player.personId === existingLine.player.personId &&
                    line.stat === existingLine.stat
                ) {
                    toast.error("Line has already been added")
                    return
                }
            }
            // Fetch game data
            setLoading(true)
            const gameLogsResponse = await axios
                .post("/api/stats/gamelogs", {
                    id: line.player.personId,
                    stat: line.stat,
                })
                .catch((error) => {
                    toast.error(error.response.data)
                })
            if (gameLogsResponse) {
                console.log(line)

                setLines((prev) => [
                    ...prev,
                    { ...line, logs: gameLogsResponse.data },
                ])
                setLine({
                    player: {},
                    stat: "pts",
                    operator: "over",
                    value: 0.5,
                })
            }
        } catch (error) {
            toast.error("Error adding line")
            console.log(error)
        }

        setLoading(false)
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
                    <select name="stat" value={line.stat} onChange={onChange}>
                        <option value={"pts"}>Points</option>
                        <option value={"reb"}>Rebounds</option>
                        <option value={"ast"}>Assists</option>
                        <option value={"stl"}>Steals</option>
                        <option value={"blk"}>Blocks</option>
                        <option value={"tov"}>Turnovers</option>
                        <option value={"3pm"}>Threes Made</option>
                        <option value={"pts+reb"}>Points and Rebounds</option>
                        <option value={"pts+ast"}>Points and Assists</option>
                        <option value={"ast+reb"}>Assists and Rebounds</option>
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
                            <select
                                name="value"
                                value={line.value}
                                onChange={onChange}
                            >
                                {Array.from(
                                    { length: 100 },
                                    (_, i) => i + 0.5
                                ).map((val) => (
                                    <option key={val} value={val}>
                                        {val.toFixed(1)}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>
            <div className="submit">
                {!loading ? (
                    <button className="green" onClick={addLine}>
                        <div className="button-content">
                            <div className="content">
                                <FaPlus />
                            </div>
                            <div>Add Line</div>
                        </div>
                    </button>
                ) : (
                    <div className="spinner-container">
                        <Spinner size="small" />
                    </div>
                )}
            </div>
            <div className="timestamp">Updated {roster.timestamp}</div>
        </div>
    )
}

export default Builder
