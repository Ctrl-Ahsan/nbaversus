import { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import axios from "axios"
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { FaCrown } from "react-icons/fa"
import Title from "./Title"
import Menu from "./Menu"
import Stats from "./Stats"
import Leaderboard from "./Leaderboard"
import User from "./User"
import Compare from "./Compare"
import { AppContext } from "../AppContext"
import roster from "../players.json"

const Versus = () => {
    const {
        player1,
        setPlayer1,
        player2,
        setPlayer2,
        p1Wins,
        setP1Wins,
        p2Wins,
        setP2Wins,
        sameP1,
        setSameP1,
        sameP2,
        setSameP2,
        seenPlayers,
        setSeenPlayers,
        round,
        setRound,
        menuOpen,
        setMenuOpen,
        menuClosed,
        setMenuClosed,
        toggleStats,
        toggleLeaderboard,
        toggleUser,
    } = useContext(AppContext)
    const [toggleTitle, setToggleTitle] = useState(true)
    const [toggleVersus, setToggleVersus] = useState(false)
    const [toggleCompare, setToggleCompare] = useState(false)

    const playerArray = roster.filteredPlayers

    useEffect(() => {
        // reset states
        setP1Wins(false)
        setP2Wins(false)
        setSameP1(false)
        setSameP2(false)
        setSeenPlayers([])
        setRound(1)
        // set random players
        let randomInt1 = Math.floor(Math.random() * playerArray.length)
        let randomInt2 = Math.floor(Math.random() * playerArray.length)
        while (randomInt2 === randomInt1) {
            randomInt2 = Math.floor(Math.random() * playerArray.length)
        }
        setPlayer1(playerArray[randomInt1])
        setPlayer2(playerArray[randomInt2])
    }, [])

    let formatted = ""

    // set player info
    formatted = `${player1.age} | ${player1.height} | ${player1.weight} lbs`
    const stats1 = formatted
    formatted = `${player2.age} | ${player2.height} | ${player2.weight} lbs`
    const stats2 = formatted

    // set player image and team logo
    const img1 = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player1.personId}.png`
    const img2 = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player2.personId}.png`

    const logo1 = `https://cdn.nba.com/logos/nba/${player1.teamId}/global/L/logo.svg`
    const logo2 = `https://cdn.nba.com/logos/nba/${player2.teamId}/global/L/logo.svg`

    // set corresponding background colors
    let bg1 = ""
    let bg2 = ""
    switch (player1.teamId) {
        case 1610612737:
            bg1 = "#DF393E"
            break
        case 1610612738:
            bg1 = "#096839"
            break
        case 1610612751:
            bg1 = "#000000"
            break
        case 1610612766:
            bg1 = "#065F70"
            break
        case 1610612741:
            bg1 = "#CE1241"
            break
        case 1610612739:
            bg1 = "#591E31"
            break
        case 1610612742:
            bg1 = "#024396"
            break
        case 1610612743:
            bg1 = "#0C1B34"
            break
        case 1610612765:
            bg1 = "#1C428A"
            break
        case 1610612744:
            bg1 = "#065591"
            break
        case 1610612745:
            bg1 = "#CE1241"
            break
        case 1610612754:
            bg1 = "#012D61"
            break
        case 1610612746:
            bg1 = "#9F0E25"
            break
        case 1610612747:
            bg1 = "#552582"
            break
        case 1610612763:
            bg1 = "#5D76A9"
            break
        case 1610612748:
            bg1 = "#98002E"
            break
        case 1610612749:
            bg1 = "#00471B"
            break
        case 1610612750:
            bg1 = "#0D2240"
            break
        case 1610612740:
            bg1 = "#012B5C"
            break
        case 1610612752:
            bg1 = "#156EB6"
            break
        case 1610612760:
            bg1 = "#007AC0"
            break
        case 1610612753:
            bg1 = "#0177BF"
            break
        case 1610612755:
            bg1 = "#1A71B9"
            break
        case 1610612756:
            bg1 = "#1D1260"
            break
        case 1610612757:
            bg1 = "#D9363C"
            break
        case 1610612758:
            bg1 = "#623787"
            break
        case 1610612759:
            bg1 = "#b8b8b8"
            break
        case 1610612761:
            bg1 = "#000000"
            break
        case 1610612762:
            bg1 = "#012B5C"
            break
        case 1610612764:
            bg1 = "#012B5C"
            break
        default:
            bg1 = "#051D2D"
    }
    switch (player2.teamId) {
        case 1610612737:
            bg2 = "#DF393E"
            break
        case 1610612738:
            bg2 = "#096839"
            break
        case 1610612751:
            bg2 = "#000000"
            break
        case 1610612766:
            bg2 = "#065F70"
            break
        case 1610612741:
            bg2 = "#CE1241"
            break
        case 1610612739:
            bg2 = "#591E31"
            break
        case 1610612742:
            bg2 = "#024396"
            break
        case 1610612743:
            bg2 = "#0C1B34"
            break
        case 1610612765:
            bg2 = "#1C428A"
            break
        case 1610612744:
            bg2 = "#065591"
            break
        case 1610612745:
            bg2 = "#CE1241"
            break
        case 1610612754:
            bg2 = "#012D61"
            break
        case 1610612746:
            bg2 = "#9F0E25"
            break
        case 1610612747:
            bg2 = "#552582"
            break
        case 1610612763:
            bg2 = "#5D76A9"
            break
        case 1610612748:
            bg2 = "#98002E"
            break
        case 1610612749:
            bg2 = "#00471B"
            break
        case 1610612750:
            bg2 = "#0D2240"
            break
        case 1610612740:
            bg2 = "#012B5C"
            break
        case 1610612752:
            bg2 = "#156EB6"
            break
        case 1610612760:
            bg2 = "#007AC0"
            break
        case 1610612753:
            bg2 = "#0177BF"
            break
        case 1610612755:
            bg2 = "#1A71B9"
            break
        case 1610612756:
            bg2 = "#1D1260"
            break
        case 1610612757:
            bg2 = "#D9363C"
            break
        case 1610612758:
            bg2 = "#623787"
            break
        case 1610612759:
            bg2 = "#b8b8b8"
            break
        case 1610612761:
            bg2 = "#000000"
            break
        case 1610612762:
            bg2 = "#012B5C"
            break
        case 1610612764:
            bg2 = "#012B5C"
            break
        default:
            bg2 = "#051D2D"
    }

    // handle clicks
    const handleClick1 = () => {
        if (!p1Wins && !p2Wins && !menuOpen) {
            setP1Wins(true)
            setSameP1(true)
            setSameP2(false)
            setSeenPlayers([...seenPlayers, player2.personId.toString()])
            setMenuOpen(false)
            setMenuClosed(false)
            if (round === 5) {
                if (localStorage.getItem("user") !== null) {
                    const token = JSON.parse(localStorage.getItem("user")).Token
                    axios.post(
                        "/api/votes",
                        {
                            winner: player1.personId,
                            winnerTeam: player1.teamId,
                            losers: [
                                ...seenPlayers,
                                player2.personId.toString(),
                            ],
                        },
                        {
                            headers: { Authorization: "Bearer " + token },
                        }
                    )
                } else {
                    axios.post("/api/votes", {
                        winner: player1.personId,
                        winnerTeam: player1.teamId,
                        losers: [...seenPlayers, player2.personId.toString()],
                    })
                }
            }
        }
    }
    const handleClick2 = () => {
        if (!p1Wins && !p2Wins && !menuOpen) {
            setP2Wins(true)
            setSameP2(true)
            setSameP1(false)
            setSeenPlayers([...seenPlayers, player1.personId.toString()])
            setMenuOpen(false)
            setMenuClosed(false)

            if (round === 5) {
                if (localStorage.getItem("user") !== null) {
                    const token = JSON.parse(localStorage.getItem("user")).Token
                    axios.post(
                        "/api/votes",
                        {
                            winner: player2.personId,
                            winnerTeam: player2.teamId,
                            losers: [
                                ...seenPlayers,
                                player1.personId.toString(),
                            ],
                        },
                        {
                            headers: { Authorization: "Bearer " + token },
                        }
                    )
                } else {
                    axios.post("/api/votes", {
                        winner: player2.personId,
                        winnerTeam: player2.teamId,
                        losers: [...seenPlayers, player1.personId.toString()],
                    })
                }
            }
        }
    }

    // styling
    const VersusContainer = styled.main`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
        max-height: -webkit-fill-available;

        & #one {
            background-color: ${bg1};
            ${p2Wins ? "filter: brightness(30%);" : ""}
        }
        & #two {
            background-color: ${bg2};
            ${p1Wins ? "filter: brightness(30%);" : ""}
        }
        & .panel {
            height: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
            transition: all 0.3s;

            ${!p1Wins && !p2Wins && !menuOpen ? "cursor: pointer;" : ""}
            ${!p1Wins && !p2Wins && !menuOpen
                ? ":active{scale: 1.2; transition: scale 0.1s; z-index: 2;}"
                : ""}


            & img,
            svg {
                -webkit-tap-highlight-color: transparent;
                -webkit-user-drag: none;
            }

            & .info {
                margin: auto;
                z-index: 1;
                position: relative;
            }
            & .image-container {
                z-index: 1;
                height: 30vh;
            }
            & .name {
                font-size: 2em;
                font-weight: 700;
                margin-bottom: 0.3rem;
            }
            & .stats {
                font-size: 1em;
                font-weight: 400;
            }
            & .logoBG {
                position: absolute;
                left: 50%;
                top: 60%;
                transform: translate(-50%, -50%);
                z-index: 0;
                height: 150%;
                opacity: 10%;
            }
            & .player {
                max-height: 30vh;
                max-width: 100%;
                z-index: 1;
            }
        }
    `

    const Panel1 = () => {
        return (
            <div
                id="one"
                className={
                    !sameP1 && !p1Wins && !p2Wins && !menuOpen && !menuClosed
                        ? "panel tilt-in-fwd-tr"
                        : p1Wins && !menuOpen && !menuClosed
                        ? "panel shake-horizontal"
                        : "panel"
                }
                onClick={handleClick1}
            >
                <div className="info">
                    <div>
                        {round === 5 && p1Wins && (
                            <div
                                className={
                                    !menuOpen && !menuClosed ? "fade-in" : ""
                                }
                            >
                                <FaCrown />
                            </div>
                        )}
                        <div className="name">{player1.name}</div>
                        <div className="stats">{stats1}</div>
                    </div>
                </div>
                <div className="image-container">
                    {player1 && <img className="player" src={img1} alt="" />}
                </div>
                {player1 && <img className="logoBG" src={logo1} alt="" />}
            </div>
        )
    }
    const Panel2 = () => {
        return (
            <div
                id="two"
                className={
                    !sameP2 && !p1Wins && !p2Wins && !menuOpen && !menuClosed
                        ? "panel tilt-in-fwd-bl"
                        : p2Wins && !menuOpen && !menuClosed
                        ? "panel shake-horizontal"
                        : "panel"
                }
                onClick={handleClick2}
            >
                <div className="info">
                    {round === 5 && p2Wins && (
                        <div
                            className={
                                !menuOpen && !menuClosed ? "fade-in" : ""
                            }
                        >
                            <FaCrown />
                        </div>
                    )}
                    <div className="name">{player2.name}</div>
                    <div className="stats">{stats2}</div>
                </div>

                <div className="image-container">
                    {player2 && <img className="player" src={img2} alt="" />}
                </div>
                {player2 && <img className="logoBG" src={logo2} alt="" />}
            </div>
        )
    }

    if (toggleTitle) {
        return (
            <Title
                setToggleTitle={setToggleTitle}
                setToggleVersus={setToggleVersus}
                setToggleCompare={setToggleCompare}
            />
        )
    }

    if (toggleVersus) {
        return (
            <>
                <VersusContainer>
                    <Panel1 />
                    <Panel2 />
                </VersusContainer>
                {!menuOpen && (
                    <div className="progress-stepper">
                        <CircularProgressbarWithChildren
                            value={round}
                            maxValue={5}
                            background
                            styles={buildStyles({
                                backgroundColor: "rgba(365, 365, 365, 0.4)",
                                textColor: "#fff",
                                pathColor: "#fff",
                                trailColor: "transparent",
                            })}
                        >
                            {round === 5 && (p1Wins || p2Wins) ? (
                                <FaCrown
                                    className={
                                        !menuOpen && !menuClosed
                                            ? "fade-in"
                                            : ""
                                    }
                                />
                            ) : (
                                <span
                                    style={{
                                        fontSize: "0.7em",
                                        fontWeight: 700,
                                    }}
                                >
                                    {round} / 5
                                </span>
                            )}
                        </CircularProgressbarWithChildren>
                    </div>
                )}
                {!menuOpen && <Menu playerArray={playerArray} />}
                {toggleStats && <Stats />}
                {toggleLeaderboard && <Leaderboard />}
                {toggleUser && <User />}
            </>
        )
    }

    if (toggleCompare) return <Compare />
}

export default Versus
