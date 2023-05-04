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
import { useEffect } from "react"

const Compare = (props) => {
    const [selectedPlayers, setSelectedPlayers] = useState([])
    const [loading, setLoading] = useState(false)
    const [players, setPlayers] = useState([...roster.allPlayers])

    const getTeamColor = (color) => {
        switch (color) {
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
            .post("/api/stats", {
                ids: [player.personId],
            })
            .catch((error) => {
                setLoading(false)
                toast.error(error.response.data)
            })
        if (statsResponse) {
            const playerIndex = players.findIndex(
                (entry) => entry.personId === player.personId
            )
            setPlayers((prev) => {
                prev.splice(playerIndex, 1)
                return prev
            })
            player.stats = statsResponse.data[player.personId]
            setSelectedPlayers((prev) => [...prev, player])
            setLoading(false)
        }
    }

    const onRemove = (player) => {
        let remainingPlayers = selectedPlayers
        remainingPlayers.splice(selectedPlayers.indexOf(player), 1)
        setSelectedPlayers([...remainingPlayers])
        setPlayers((prev) => {
            prev.push(player)
            return prev
        })
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
                font-size: 0.8em;
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
            ${!!selectedPlayers.length ? "margin-left: 1em;" : ""}

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
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
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
                    border: solid 0.5px gray;

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
                    & .stat {
                        display: flex;
                        flex-direction: column;
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

    return (
        <CompareContainer>
            <div className="back">
                <IoIosArrowBack
                    fontSize={"2.5em"}
                    onClick={() => {
                        setPlayers([...roster.allPlayers])
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
                    <div className="message fade-in">
                        <div>
                            <IoPersonAdd fontSize={"4em"} />
                        </div>
                        Select players to compare.
                    </div>
                )}

                <div className="players">
                    {selectedPlayers.map((player) => {
                        return (
                            <div
                                key={JSON.stringify(player.id)}
                                className="column"
                                style={{
                                    backgroundColor: getTeamColor(
                                        player.teamId
                                    ),
                                }}
                            >
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
                                    <div className="info">{`${player.age} | ${player.height} | ${player.weight}lbs`}</div>
                                </div>
                                <div className="stat">
                                    <div className="heading">GP</div>
                                    <div>{player.stats.GP}</div>
                                    <div className="subtitle">
                                        ({player.stats.GP_RANK}
                                        {suffix(player.stats.GP_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">MIN</div>
                                    <div>{player.stats.MIN}</div>
                                    <div className="subtitle">
                                        ({player.stats.MIN_RANK}
                                        {suffix(player.stats.MIN_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">PTS</div>
                                    <div>{player.stats.PTS}</div>
                                    <div className="subtitle">
                                        ({player.stats.PTS_RANK}
                                        {suffix(player.stats.PTS_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">REB</div>
                                    <div>{player.stats.REB}</div>
                                    <div className="subtitle">
                                        ({player.stats.REB_RANK}
                                        {suffix(player.stats.REB_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">AST</div>
                                    <div>{player.stats.AST}</div>
                                    <div className="subtitle">
                                        ({player.stats.AST_RANK}
                                        {suffix(player.stats.AST_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">STL</div>
                                    <div>{player.stats.STL}</div>
                                    <div className="subtitle">
                                        ({player.stats.STL_RANK}
                                        {suffix(player.stats.STL_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">BLK</div>
                                    <div>{player.stats.BLK}</div>
                                    <div className="subtitle">
                                        ({player.stats.BLK_RANK}
                                        {suffix(player.stats.BLK_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">FG%</div>
                                    <div>
                                        {(player.stats.FG_PCT * 100).toFixed(1)}
                                    </div>
                                    <div className="subtitle">
                                        ({player.stats.FG_PCT_RANK}
                                        {suffix(player.stats.FG_PCT_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">3P%</div>
                                    <div>
                                        {(player.stats.FG3_PCT * 100).toFixed(
                                            1
                                        )}
                                    </div>
                                    <div className="subtitle">
                                        ({player.stats.FG3_PCT_RANK}
                                        {suffix(player.stats.FG3_PCT_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">FT%</div>
                                    <div>
                                        {(player.stats.FT_PCT * 100).toFixed(1)}
                                    </div>
                                    <div className="subtitle">
                                        ({player.stats.FT_PCT_RANK}
                                        {suffix(player.stats.FT_PCT_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">TOV</div>
                                    <div>{player.stats.TOV}</div>
                                    <div className="subtitle">
                                        ({player.stats.TOV_RANK}
                                        {suffix(player.stats.TOV_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">PF</div>
                                    <div>{player.stats.PF}</div>
                                    <div className="subtitle">
                                        ({player.stats.PF_RANK}
                                        {suffix(player.stats.PF_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">PFD</div>
                                    <div>{player.stats.PFD}</div>
                                    <div className="subtitle">
                                        ({player.stats.PFD_RANK}
                                        {suffix(player.stats.PFD_RANK)})
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="heading">+/-</div>
                                    <div>{player.stats.PLUS_MINUS}</div>
                                    <div className="subtitle">
                                        ({player.stats.PLUS_MINUS_RANK}
                                        {suffix(player.stats.PLUS_MINUS_RANK)})
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {loading && (
                        <div
                            className="column shimmerBG"
                            style={{ height: "71em", width: "7em" }}
                        ></div>
                    )}
                </div>
            </div>
        </CompareContainer>
    )
}

export default Compare
