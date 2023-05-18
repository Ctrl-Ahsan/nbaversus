import styled from "styled-components"
import { ReactSearchAutocomplete } from "react-search-autocomplete"
import { FaSearch } from "react-icons/fa"
import roster from "../players.json"
import { useState } from "react"
import axios from "axios"
import { AiOutlineClose } from "react-icons/ai"
import { toast } from "react-toastify"
import { IoIosArrowBack } from "react-icons/io"
import { IoReloadCircle, IoPersonAdd } from "react-icons/io5"

const Compare = (props) => {
    const [selectedPlayers, setSelectedPlayers] = useState([])
    const [selectedScopes, setSelectedScopes] = useState([])
    const [loading, setLoading] = useState(false)
    const players = [...roster.allPlayers]

    const getTeamColor = (teamID) => {
        switch (teamID) {
            case 1610612737:
                return "#df393fd0"

            case 1610612738:
                return "#096839d0"

            case 1610612751:
                return "#000000d0"

            case 1610612766:
                return "#065F70d0"

            case 1610612741:
                return "#ce1241d0"

            case 1610612739:
                return "#591E31d0"

            case 1610612742:
                return "#024396d0"

            case 1610612743:
                return "#0C1B34d0"

            case 1610612765:
                return "#1C428Ad0"

            case 1610612744:
                return "#065591d0"

            case 1610612745:
                return "#CE1241d0"

            case 1610612754:
                return "#012D61d0"

            case 1610612746:
                return "#9F0E25d0"

            case 1610612747:
                return "#552582d0"

            case 1610612763:
                return "#5D76A9d0"

            case 1610612748:
                return "#98002Ed0"

            case 1610612749:
                return "#00471Bd0"

            case 1610612750:
                return "#0D2240d0"

            case 1610612740:
                return "#012B5Cd0"

            case 1610612752:
                return "#156EB6d0"

            case 1610612760:
                return "#007AC0d0"

            case 1610612753:
                return "#0177BFd0"

            case 1610612755:
                return "#1A71B9d0"

            case 1610612756:
                return "#1D1260d0"

            case 1610612757:
                return "#D9363Cd0"

            case 1610612758:
                return "#623787d0"

            case 1610612759:
                return "#b8b8b8d0"

            case 1610612761:
                return "#000000d0"

            case 1610612762:
                return "#012B5Cd0"

            case 1610612764:
                return "#012B5Cd0"

            default:
                return "#051D2Dd0"
        }
    }

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
            setSelectedScopes((prev) => [...prev, "CareerS"])
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
    const CompareContainer = styled.main`
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        max-height: -webkit-fill-available;
        background: linear-gradient(270deg, #860000, #013a6b);

        & .back {
            position: absolute;
            z-index: 1;
            top: 5%;
            left: 3%;
            color: white;
            cursor: pointer;

            & svg {
                transition: all 0.3s;
                :hover {
                    scale: 1.05;
                }
                :active {
                    scale: 0.9;
                }
            }
        }

        & .title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2em;
            font-weight: 700;
            padding: 10px 20px;
            margin-top: 1em;
            margin-bottom: 0.5em;
            svg {
                font-size: 0.7em;
                margin-right: 0.3em;
            }
        }

        & .search {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80%;
            max-width: 500px;
            ${selectedPlayers.length > 1 ? "margin-left: 1em;" : ""}

            & .search-bar {
                width: 100%;
                z-index: 2;
                & .input {
                    font-family: inherit;
                    color: white;
                    padding: 1em 1.5em;
                    border: 1px solid rgba(148, 148, 148, 0.3);
                    border-radius: 50px;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
            }
            & .reload {
                margin-left: 0.5em;
                height: 100%;
                display: flex;
                align-items: center;
                & svg {
                    cursor: pointer;
                    transition: all 0.3s;
                    -webkit-tap-highlight-color: transparent;
                    :hover {
                        scale: 1.05;
                    }
                    :active {
                        scale: 0.9;
                        color: #bd7b00 !important;
                    }
                }
            }
        }

        & .compare {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            background-color: #0000007a;
            border: solid 1px #21212179;
            margin-top: 1em;
            overflow: scroll;

            & .message {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
                color: gray;
            }
            & .players {
                display: flex;
                margin-left: auto;
                margin-right: auto;

                & .column {
                    position: relative;
                    display: grid;
                    grid-row-gap: 0.5em;
                    min-height: 100%;
                    height: max-content;
                    border-radius: 10px;
                    margin: 1em 0.5em;
                    padding-bottom: 0.5em;
                    border: solid 1px gray;

                    & .team {
                        position: absolute;
                        top: 0.4em;
                        left: 0.5em;
                        height: 1.5em;
                        width: 1.5em;
                    }

                    & .close {
                        font-size: 0.9em;
                        position: absolute;
                        top: 0.6em;
                        right: 0.6em;
                        cursor: pointer;
                        transition: all 0.3s;
                        :active {
                            scale: 0.9;
                        }
                    }
                    & .player {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        height: 7em;
                        width: 7em;
                        margin-top: 1em;
                        padding: 0.4em;

                        & img {
                            height: 3.5em;
                            border-radius: 100px;
                        }
                        & .vertical-offset {
                            height: 8em;
                            padding: 0.4em;
                        }
                        & .name {
                            height: 3em;
                            display: flex;
                            align-items: center;
                            margin-top: 0.2em;
                            font-size: 0.9em;
                            font-family: Roboto Condensed, Roboto, Arial;
                            font-weight: 700;
                        }
                        & .info {
                            font-size: 0.65em;
                            font-weight: 300;
                            color: white;
                        }
                    }

                    & .scope {
                        & select {
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                            background-color: #0000007a;
                            border-radius: 1em;
                            border-color: #808080d6;
                            padding: 0.2em 0;
                            font-family: Roboto Condensed, Roboto, Arial;
                            font-weight: 700;
                            font-size: 0.8em;
                            color: #e0e0e0;
                            text-indent: 0.5em;
                            cursor: pointer;
                        }
                    }

                    & .stat {
                        display: flex;
                        flex-direction: column;
                        height: 3em;
                        width: 7em;
                        padding: 0.4em;

                        & .heading {
                            font-family: Roboto Condensed, Roboto, Arial;
                            font-size: 0.9em;
                            font-weight: 700;
                            margin-bottom: 0.3em;
                        }
                        & .subtitle {
                            font-size: 0.6em;
                            font-weight: 300;
                            color: darkgray;
                            margin-top: 0.1em;
                        }
                    }
                }
            }
        }
    `

    const SearchBar = () => {
        return (
            <>
                <div className="search">
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
                    {selectedPlayers.length > 1 && (
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
                    backgroundColor: getTeamColor(getTeamID()),
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
                        <optgroup label="Playoffs">
                            <option value={"CareerP"}>Career</option>
                            {SeasonTotalsPostSeason.map((item, index) => (
                                <option value={`${index}P`}>{item[1]}</option>
                            ))}
                        </optgroup>
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
        <CompareContainer>
            <div className="back">
                <IoIosArrowBack
                    fontSize={"2.5em"}
                    onClick={() => {
                        props.setToggleTitle(true)
                        props.setToggleCompare(false)
                    }}
                />
            </div>
            <div className="title">
                <FaSearch /> Compare
            </div>
            <SearchBar />
            <div className="compare">
                {selectedPlayers.length === 0 && !loading && (
                    <div className="message scale-in-center">
                        <div>
                            <IoPersonAdd fontSize={"4em"} />
                        </div>
                        Select players to compare.
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
        </CompareContainer>
    )
}

export default Compare
