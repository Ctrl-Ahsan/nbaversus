import "./Compare.css"
import { useContext, useState } from "react"
import axios from "axios"
import { ReactSearchAutocomplete } from "react-search-autocomplete"
import { toast } from "react-toastify"

import { AppContext } from "../../AppContext"
import roster from "../../players.json"
import { teamColors, defaultColor } from "../../config"

import { AiOutlineClose } from "react-icons/ai"
import { FaUsers } from "react-icons/fa"
import { IoReloadCircle } from "react-icons/io5"

const Compare = () => {
    const {
        selectedPlayers,
        setSelectedPlayers,
        selectedScopes,
        setSelectedScopes,
    } = useContext(AppContext)
    const [loading, setLoading] = useState(false)
    const players = [...roster.allPlayers]

    const onSelect = async (player) => {
        setLoading(true)
        const statsResponse = await axios
            .post("/api/stats/career", {
                id: player.personId,
            })
            .catch((error) => {
                setLoading(false)
                toast.error(error.response.data)
            })
        if (statsResponse) {
            player.stats = statsResponse.data
            setSelectedPlayers((prev) => [...prev, player])
            setSelectedScopes((prev) => [...prev, "0S"])
            setLoading(false)
        }
    }

    const onRemove = (player) => {
        let remainingPlayers = selectedPlayers
        let remainingScopes = selectedScopes
        selectedScopes.splice(selectedPlayers.indexOf(player), 1)
        remainingPlayers.splice(selectedPlayers.indexOf(player), 1)
        setSelectedPlayers([...remainingPlayers])
        setSelectedScopes([...remainingScopes])
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

    const suffix = (num) => {
        if (num > 3 && num < 14) return "th"
        const lastChar = num.toString().slice(-1)
        switch (lastChar) {
            case "1":
                return "st"
            case "2":
                return "nd"
            case "3":
                return "rd"
            default:
                return "th"
        }
    }

    const SearchBar = () => {
        return (
            <>
                <div
                    className="search"
                    style={{
                        marginLeft: selectedPlayers.length > 0 ? "1em" : "",
                    }}
                >
                    <div className="search-bar">
                        <ReactSearchAutocomplete
                            items={players}
                            placeholder={"Search..."}
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
                    {selectedPlayers.length > 0 && (
                        <div className="reload">
                            <IoReloadCircle
                                onClick={() => {
                                    selectedPlayers.forEach((player) => {
                                        players.push(player)
                                    })
                                    setSelectedPlayers([])
                                    setSelectedScopes([])
                                }}
                                style={{
                                    color: "orange",
                                    fontSize: "37.5px",
                                }}
                            />
                        </div>
                    )}
                </div>
            </>
        )
    }

    const PlayerCard = (props) => {
        const [scope, setScope] = useState(selectedScopes[props.index])
        const player = props.player

        const SeasonTotalsRegularSeason = player.stats[0].rowSet
        const SeasonRankingsRegularSeason = player.stats[10].rowSet
        const CareerTotalsRegularSeason = player.stats[1].rowSet
        const SeasonTotalsPostSeason = player.stats[2].rowSet
        const SeasonRankingsPostSeason = player.stats[11].rowSet
        const CareerTotalsPostSeason = player.stats[3].rowSet

        const GP = 6
        const MIN = 8
        const RANK_MIN = 8
        const PTS = 26
        const RANK_PTS = 25
        const REB = 20
        const RANK_REB = 20
        const AST = 21
        const RANK_AST = 21
        const STL = 22
        const RANK_STL = 22
        const BLK = 23
        const RANK_BLK = 23
        const FGP = 11
        const RANK_FGP = 11
        const TPP = 14
        const RANK_TPP = 14
        const FTP = 17
        const RANK_FTP = 17
        const TOV = 24
        const RANK_TOV = 24
        const PF = 25

        const getPlayerAge = () => {
            if (scope.slice(0, 1) !== "C") {
                if (scope.slice(-1) === "S") {
                    return SeasonTotalsRegularSeason[scope.slice(0, -1)][5]
                } else if (scope.slice(-1) === "P") {
                    return SeasonTotalsRegularSeason[scope.slice(0, -1)][5]
                }
            } else {
                return player.age
            }
        }
        const getTeamID = () => {
            if (scope.slice(0, 1) !== "C") {
                if (scope.slice(-1) === "S") {
                    if (SeasonTotalsRegularSeason[scope.slice(0, -1)][3] !== 0)
                        return SeasonTotalsRegularSeason[scope.slice(0, -1)][3]
                    else return player.teamId
                } else if (scope.slice(-1) === "P") {
                    if (SeasonTotalsPostSeason[scope.slice(0, -1)][3] !== 0)
                        return SeasonTotalsPostSeason[scope.slice(0, -1)][3]
                    else return player.teamId
                }
            } else {
                return player.teamId
            }
        }

        return (
            <div
                className="column"
                style={{
                    backgroundColor: teamColors[getTeamID()] || defaultColor,
                    borderColor: scope.slice(-1) === "P" ? "#b49900" : "",
                }}
            >
                <div className="team">
                    <img
                        src={`https://cdn.nba.com/logos/nba/${getTeamID()}/primary/L/logo.svg`}
                        alt=""
                    />
                </div>
                <div
                    className="close"
                    onClick={() => {
                        onRemove(player)
                    }}
                >
                    <AiOutlineClose />
                </div>
                <div className="player">
                    <div>
                        <img
                            src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${player.personId}.png`}
                            alt=""
                        />
                    </div>
                    <div className="name">{player.name}</div>
                    <div className="info">{`${getPlayerAge()} | ${
                        player.height
                    } | ${player.weight}lbs`}</div>
                </div>
                <div className="scope">
                    <select
                        value={scope}
                        style={
                            scope.slice(0, 1) === "C"
                                ? { textIndent: "0.8em" }
                                : {}
                        }
                        onChange={(e) => {
                            setSelectedScopes((prev) => {
                                prev[props.index] = e.target.value
                                return prev
                            })
                            setScope(selectedScopes[props.index])
                        }}
                    >
                        <optgroup label="Regular Season">
                            <option value={"CareerS"}>Career</option>
                            {SeasonTotalsRegularSeason.map((item, index) => (
                                <option value={`${index}S`}>{item[1]}</option>
                            ))}
                        </optgroup>
                        {SeasonTotalsPostSeason.length > 0 && (
                            <optgroup label="Playoffs">
                                <option value={"CareerP"}>Career</option>
                                {SeasonTotalsPostSeason.map((item, index) => (
                                    <option value={`${index}P`}>
                                        {item[1]}
                                    </option>
                                ))}
                            </optgroup>
                        )}
                    </select>
                </div>
                {scope.slice(-1) === "S" &&
                    (scope.slice(0, 1) === "C" ? (
                        <>
                            <div className="stat">
                                <div className="heading">GP</div>
                                <div>{CareerTotalsRegularSeason[0][3]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">MIN</div>
                                <div>{CareerTotalsRegularSeason[0][5]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">PTS</div>
                                <div>{CareerTotalsRegularSeason[0][23]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">REB</div>
                                <div>{CareerTotalsRegularSeason[0][17]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">AST</div>
                                <div>{CareerTotalsRegularSeason[0][18]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">STL</div>
                                <div>{CareerTotalsRegularSeason[0][19]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">BLK</div>
                                <div>{CareerTotalsRegularSeason[0][20]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">FG%</div>
                                <div>
                                    {(
                                        CareerTotalsRegularSeason[0][8] * 100
                                    ).toFixed(1)}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">3P%</div>
                                <div>
                                    {(
                                        CareerTotalsRegularSeason[0][11] * 100
                                    ).toFixed(1)}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">FT%</div>
                                <div>
                                    {(
                                        CareerTotalsRegularSeason[0][14] * 100
                                    ).toFixed(1)}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">TOV</div>
                                <div>{CareerTotalsRegularSeason[0][21]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">PF</div>
                                <div>{CareerTotalsRegularSeason[0][22]}</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="stat">
                                <div className="heading">GP</div>
                                <div>
                                    {
                                        SeasonTotalsRegularSeason[
                                            scope.slice(0, -1)
                                        ][GP]
                                    }
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">MIN</div>
                                <div>
                                    {
                                        SeasonTotalsRegularSeason[
                                            scope.slice(0, -1)
                                        ][MIN]
                                    }
                                    {SeasonRankingsRegularSeason[
                                        scope.slice(0, -1)
                                    ][RANK_MIN] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsRegularSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_MIN]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsRegularSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_MIN]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">PTS</div>
                                <div>
                                    {
                                        SeasonTotalsRegularSeason[
                                            scope.slice(0, -1)
                                        ][PTS]
                                    }
                                    {SeasonRankingsRegularSeason[
                                        scope.slice(0, -1)
                                    ][RANK_PTS] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsRegularSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_PTS]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsRegularSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_PTS]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">REB</div>
                                <div>
                                    {
                                        SeasonTotalsRegularSeason[
                                            scope.slice(0, -1)
                                        ][REB]
                                    }
                                    {SeasonRankingsRegularSeason[
                                        scope.slice(0, -1)
                                    ][RANK_REB] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsRegularSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_REB]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsRegularSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_REB]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">AST</div>
                                <div>
                                    {
                                        SeasonTotalsRegularSeason[
                                            scope.slice(0, -1)
                                        ][AST]
                                    }
                                    {SeasonRankingsRegularSeason[
                                        scope.slice(0, -1)
                                    ][RANK_AST] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsRegularSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_AST]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsRegularSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_AST]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">STL</div>
                                <div>
                                    {
                                        SeasonTotalsRegularSeason[
                                            scope.slice(0, -1)
                                        ][STL]
                                    }
                                    {SeasonRankingsRegularSeason[
                                        scope.slice(0, -1)
                                    ][RANK_STL] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsRegularSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_STL]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsRegularSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_STL]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">BLK</div>
                                <div>
                                    {
                                        SeasonTotalsRegularSeason[
                                            scope.slice(0, -1)
                                        ][BLK]
                                    }
                                    {SeasonRankingsRegularSeason[
                                        scope.slice(0, -1)
                                    ][RANK_BLK] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsRegularSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_BLK]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsRegularSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_BLK]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">FG%</div>
                                <div>
                                    {(
                                        SeasonTotalsRegularSeason[
                                            scope.slice(0, -1)
                                        ][FGP] * 100
                                    ).toFixed(1)}
                                    {SeasonRankingsRegularSeason[
                                        scope.slice(0, -1)
                                    ][RANK_FGP] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsRegularSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_FGP]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsRegularSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_FGP]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">3P%</div>
                                <div>
                                    {(
                                        SeasonTotalsRegularSeason[
                                            scope.slice(0, -1)
                                        ][TPP] * 100
                                    ).toFixed(1)}
                                    {SeasonRankingsRegularSeason[
                                        scope.slice(0, -1)
                                    ][RANK_TPP] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsRegularSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_TPP]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsRegularSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_TPP]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">FT%</div>
                                <div>
                                    {(
                                        SeasonTotalsRegularSeason[
                                            scope.slice(0, -1)
                                        ][FTP] * 100
                                    ).toFixed(1)}
                                    {SeasonRankingsRegularSeason[
                                        scope.slice(0, -1)
                                    ][RANK_FTP] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsRegularSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_FTP]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsRegularSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_FTP]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">TOV</div>
                                <div>
                                    {
                                        SeasonTotalsRegularSeason[
                                            scope.slice(0, -1)
                                        ][TOV]
                                    }
                                    {SeasonRankingsRegularSeason[
                                        scope.slice(0, -1)
                                    ][RANK_TOV] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsRegularSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_TOV]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsRegularSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_TOV]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">PF</div>
                                <div>
                                    {
                                        SeasonTotalsRegularSeason[
                                            scope.slice(0, -1)
                                        ][PF]
                                    }
                                </div>
                            </div>
                        </>
                    ))}
                {scope.slice(-1) === "P" &&
                    (scope.slice(0, 1) === "C" ? (
                        <>
                            <div className="stat">
                                <div className="heading">GP</div>
                                <div>{CareerTotalsPostSeason[0][3]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">MIN</div>
                                <div>{CareerTotalsPostSeason[0][5]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">PTS</div>
                                <div>{CareerTotalsPostSeason[0][23]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">REB</div>
                                <div>{CareerTotalsPostSeason[0][17]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">AST</div>
                                <div>{CareerTotalsPostSeason[0][18]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">STL</div>
                                <div>{CareerTotalsPostSeason[0][19]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">BLK</div>
                                <div>{CareerTotalsPostSeason[0][20]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">FG%</div>
                                <div>
                                    {(
                                        CareerTotalsPostSeason[0][8] * 100
                                    ).toFixed(1)}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">3P%</div>
                                <div>
                                    {(
                                        CareerTotalsPostSeason[0][11] * 100
                                    ).toFixed(1)}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">FT%</div>
                                <div>
                                    {(
                                        CareerTotalsPostSeason[0][14] * 100
                                    ).toFixed(1)}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">TOV</div>
                                <div>{CareerTotalsPostSeason[0][21]}</div>
                            </div>
                            <div className="stat">
                                <div className="heading">PF</div>
                                <div>{CareerTotalsPostSeason[0][22]}</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="stat">
                                <div className="heading">GP</div>
                                <div>
                                    {
                                        SeasonTotalsPostSeason[
                                            scope.slice(0, -1)
                                        ][GP]
                                    }
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">MIN</div>
                                <div>
                                    {
                                        SeasonTotalsPostSeason[
                                            scope.slice(0, -1)
                                        ][MIN]
                                    }
                                    {SeasonRankingsPostSeason[
                                        scope.slice(0, -1)
                                    ][RANK_MIN] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsPostSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_MIN]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsPostSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_MIN]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">PTS</div>
                                <div>
                                    {
                                        SeasonTotalsPostSeason[
                                            scope.slice(0, -1)
                                        ][PTS]
                                    }
                                    {SeasonRankingsPostSeason[
                                        scope.slice(0, -1)
                                    ][RANK_PTS] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsPostSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_PTS]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsPostSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_PTS]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">REB</div>
                                <div>
                                    {
                                        SeasonTotalsPostSeason[
                                            scope.slice(0, -1)
                                        ][REB]
                                    }
                                    {SeasonRankingsPostSeason[
                                        scope.slice(0, -1)
                                    ][RANK_REB] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsPostSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_REB]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsPostSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_REB]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">AST</div>
                                <div>
                                    {
                                        SeasonTotalsPostSeason[
                                            scope.slice(0, -1)
                                        ][AST]
                                    }
                                    {SeasonRankingsPostSeason[
                                        scope.slice(0, -1)
                                    ][RANK_AST] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsPostSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_AST]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsPostSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_AST]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">STL</div>
                                <div>
                                    {
                                        SeasonTotalsPostSeason[
                                            scope.slice(0, -1)
                                        ][STL]
                                    }
                                    {SeasonRankingsPostSeason[
                                        scope.slice(0, -1)
                                    ][RANK_STL] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsPostSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_STL]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsPostSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_STL]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">BLK</div>
                                <div>
                                    {
                                        SeasonTotalsPostSeason[
                                            scope.slice(0, -1)
                                        ][BLK]
                                    }
                                    {SeasonRankingsPostSeason[
                                        scope.slice(0, -1)
                                    ][RANK_BLK] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsPostSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_BLK]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsPostSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_BLK]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">FG%</div>
                                <div>
                                    {(
                                        SeasonTotalsPostSeason[
                                            scope.slice(0, -1)
                                        ][FGP] * 100
                                    ).toFixed(1)}
                                    {SeasonRankingsPostSeason[
                                        scope.slice(0, -1)
                                    ][RANK_FGP] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsPostSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_FGP]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsPostSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_FGP]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">3P%</div>
                                <div>
                                    {(
                                        SeasonTotalsPostSeason[
                                            scope.slice(0, -1)
                                        ][TPP] * 100
                                    ).toFixed(1)}
                                    {SeasonRankingsPostSeason[
                                        scope.slice(0, -1)
                                    ][RANK_TPP] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsPostSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_TPP]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsPostSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_TPP]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">FT%</div>
                                <div>
                                    {(
                                        SeasonTotalsPostSeason[
                                            scope.slice(0, -1)
                                        ][FTP] * 100
                                    ).toFixed(1)}
                                    {SeasonRankingsPostSeason[
                                        scope.slice(0, -1)
                                    ][RANK_FTP] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsPostSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_FTP]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsPostSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_FTP]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">TOV</div>
                                <div>
                                    {
                                        SeasonTotalsPostSeason[
                                            scope.slice(0, -1)
                                        ][TOV]
                                    }
                                    {SeasonRankingsPostSeason[
                                        scope.slice(0, -1)
                                    ][RANK_TOV] && (
                                        <div className="subtitle">
                                            (
                                            {
                                                SeasonRankingsPostSeason[
                                                    scope.slice(0, -1)
                                                ][RANK_TOV]
                                            }
                                            {suffix(
                                                parseInt(
                                                    SeasonRankingsPostSeason[
                                                        scope.slice(0, -1)
                                                    ][RANK_TOV]
                                                )
                                            )}
                                            )
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="stat">
                                <div className="heading">PF</div>
                                <div>
                                    {
                                        SeasonTotalsPostSeason[
                                            scope.slice(0, -1)
                                        ][PF]
                                    }
                                </div>
                            </div>
                        </>
                    ))}
            </div>
        )
    }

    return (
        <main className="compare-container">
            <div className="header">
                <SearchBar />
            </div>
            <div className="compare">
                {selectedPlayers.length === 0 && !loading && (
                    <div className="message">
                        <div>
                            <FaUsers fontSize={"4em"} />
                        </div>
                        Select players to compare
                    </div>
                )}

                <div className="players">
                    {selectedPlayers.map((player, index) => {
                        return <PlayerCard player={player} index={index} />
                    })}
                    {loading && (
                        <div
                            className="column shimmerBG"
                            style={{ height: "62.25em", width: "7em" }}
                        ></div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default Compare
