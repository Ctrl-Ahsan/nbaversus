import { useEffect, useContext } from "react"
import styled from "styled-components"
import axios from "axios"
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

import { AppContext } from "../../AppContext"
import roster from "../../roster.json"
import { teamColors, defaultColor } from "../../config"
import Stats from "./Stats"
import Leaderboard from "./Leaderboard"

import { FaCrown } from "react-icons/fa"
import {
    IoReloadCircle,
    IoInformationCircle,
    IoArrowForwardCircle,
} from "react-icons/io5"
import { GiPodium } from "react-icons/gi"
import { getAuthToken } from "../../utils/getAuthToken"
import { useNavigate } from "react-router-dom"

const Versus = () => {
    const {
        user,
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
        stats,
        setStats,
        leaderboard,
        setLeaderboard,
    } = useContext(AppContext)
    const navigate = useNavigate()

    const playerArray = roster.filteredPlayers

    useEffect(() => {
        if (
            JSON.stringify(player1) === "{}" ||
            JSON.stringify(player2) === "{}"
        ) {
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
        }
    }, [playerArray])

    // set player info
    let formatted = ""
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
    const bg1 = teamColors[player1.teamId] || defaultColor
    const bg2 = teamColors[player2.teamId] || defaultColor

    // handle clicks
    const handleClick1 = async () => {
        if (!p1Wins && !p2Wins && !menuOpen) {
            setP1Wins(true)
            setSameP1(true)
            setSameP2(false)
            setSeenPlayers([...seenPlayers, player2.personId.toString()])
            setMenuOpen(false)
            setMenuClosed(false)
            if (round === 3) {
                if (user) {
                    const token = await getAuthToken(user, navigate)
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
    const handleClick2 = async () => {
        if (!p1Wins && !p2Wins && !menuOpen) {
            setP2Wins(true)
            setSameP2(true)
            setSameP1(false)
            setSeenPlayers([...seenPlayers, player1.personId.toString()])
            setMenuOpen(false)
            setMenuClosed(false)

            if (round === 3) {
                if (user) {
                    const token = await getAuthToken(user, navigate)
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
    const PlayContainer = styled.main`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 92%;
        width: 100%;
        max-height: -webkit-fill-available;
        position: relative;
        overflow: hidden;

        @media screen and (min-width: 1080px) {
            height: 100%;
        }

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
                @media screen and (max-width: 540px) {
                    font-size: 1.5em;
                }
            }
            & .stats {
                font-size: 1em;
                font-weight: 400;

                @media screen and (max-width: 540px) {
                    font-size: 0.8em;
                }
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
                        {round === 3 && p1Wins && (
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
                    {round === 3 && p2Wins && (
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

    const Menu = () => {
        const handleReload = () => {
            // reset states
            setRound(1)
            setP1Wins(false)
            setP2Wins(false)
            setSameP1(false)
            setSameP2(false)
            setSeenPlayers([])
            setMenuOpen(false)
            setMenuClosed(false)
            // set random players
            let randomInt1 = Math.floor(Math.random() * playerArray.length)
            let randomInt2 = Math.floor(Math.random() * playerArray.length)
            while (randomInt2 === randomInt1) {
                randomInt2 = Math.floor(Math.random() * playerArray.length)
            }
            setPlayer1(playerArray[randomInt1])
            setPlayer2(playerArray[randomInt2])
        }
        const handleNext = () => {
            // reset states
            setMenuOpen(false)
            setMenuClosed(false)
            // increment round
            if (round < 3) setRound((prevRound) => prevRound + 1)
            else setRound(1)
            // set random player(s)
            if (round === 3) {
                let randomInt1 = Math.floor(Math.random() * playerArray.length)
                let randomInt2 = Math.floor(Math.random() * playerArray.length)
                while (randomInt2 === randomInt1) {
                    randomInt2 = Math.floor(Math.random() * playerArray.length)
                }
                setPlayer1(playerArray[randomInt1])
                setPlayer2(playerArray[randomInt2])
                setP1Wins(false)
                setP2Wins(false)
                setSameP1(false)
                setSameP2(false)
                setSeenPlayers([])
            } else {
                if (p1Wins) {
                    let randomInt = Math.floor(
                        Math.random() * playerArray.length
                    )
                    while (
                        player1 === playerArray[randomInt] ||
                        seenPlayers.includes(
                            playerArray[randomInt].personId.toString()
                        )
                    ) {
                        randomInt = Math.floor(
                            Math.random() * playerArray.length
                        )
                    }
                    setPlayer2(playerArray[randomInt])
                    setP1Wins(false)
                    setP2Wins(false)
                } else if (p2Wins) {
                    let randomInt = Math.floor(
                        Math.random() * playerArray.length
                    )
                    while (
                        player2 === playerArray[randomInt] ||
                        seenPlayers.includes(
                            playerArray[randomInt].personId.toString()
                        )
                    ) {
                        randomInt = Math.floor(
                            Math.random() * playerArray.length
                        )
                    }
                    setPlayer1(playerArray[randomInt])
                    setP1Wins(false)
                    setP2Wins(false)
                }
            }
        }

        const handleStats = () => {
            setMenuOpen(true)
            setStats(true)
        }
        const handleLeaderboard = () => {
            setMenuOpen(true)
            setLeaderboard(true)
        }

        const MenuContainer = styled.nav`
            display: flex;
            flex-direction: column;
            position: absolute;
            bottom: 4%;
            right: 0.75em;
            z-index: 3;
            align-items: center;
            font-size: 0.9em;

            @media screen and (min-width: 1080px) {
                font-size: 1em;
                bottom: 5%;
            }

            svg {
                cursor: pointer;
                margin-bottom: 2.5px;
                transition: all 0.3s;
                -webkit-tap-highlight-color: transparent;
            }
            .reload {
                @media (hover: hover) {
                    :hover {
                        color: #bb7a00 !important;
                    }
                }
                :active {
                    scale: 0.9;
                    color: #bb7a00 !important;
                }
            }
            .item {
                @media (hover: hover) {
                    :hover {
                        color: #d7d7d7 !important;
                    }
                }
                :active {
                    scale: 0.9;
                    color: #d7d7d7 !important;
                }
            }
        `

        return (
            <MenuContainer>
                {(!p1Wins && !p2Wins) || round === 3 ? (
                    <IoReloadCircle
                        onClick={handleReload}
                        className="reload"
                        style={{
                            color: "orange",
                            fontSize: "5em",
                            marginBottom: "0.1em",
                        }}
                    />
                ) : (
                    <IoArrowForwardCircle
                        className={
                            !menuOpen && !menuClosed
                                ? "scale-in-center reload"
                                : "reload"
                        }
                        onClick={handleNext}
                        style={{
                            color: "orange",
                            fontSize: "5em",
                            marginBottom: "0.1em",
                        }}
                    />
                )}
                <IoInformationCircle
                    onClick={handleStats}
                    className="item"
                    style={{ fontSize: "2.5em" }}
                />
                <GiPodium
                    onClick={handleLeaderboard}
                    className="item"
                    style={{ fontSize: "2.5em" }}
                />
            </MenuContainer>
        )
    }

    return (
        <>
            <PlayContainer>
                <Panel1 />
                <Panel2 />
                {!menuOpen && <Menu />}
                {stats && (
                    <Stats
                        player1={player1}
                        player2={player2}
                        setMenuOpen={setMenuOpen}
                        setMenuClosed={setMenuClosed}
                        setStats={setStats}
                    />
                )}
                {leaderboard && (
                    <Leaderboard
                        setMenuOpen={setMenuOpen}
                        setMenuClosed={setMenuClosed}
                        setLeaderboard={setLeaderboard}
                    />
                )}
            </PlayContainer>
            {!menuOpen && (
                <div className="progress-stepper">
                    <CircularProgressbarWithChildren
                        value={round}
                        maxValue={3}
                        background
                        styles={buildStyles({
                            backgroundColor: "rgba(365, 365, 365, 0.4)",
                            textColor: "#fff",
                            pathColor: "#fff",
                            trailColor: "transparent",
                        })}
                    >
                        {round === 3 && (p1Wins || p2Wins) ? (
                            <FaCrown
                                className={
                                    !menuOpen && !menuClosed ? "fade-in" : ""
                                }
                            />
                        ) : (
                            <span
                                style={{
                                    fontSize: "0.7em",
                                    fontWeight: 700,
                                }}
                            >
                                {round} / 3
                            </span>
                        )}
                    </CircularProgressbarWithChildren>
                </div>
            )}
        </>
    )
}

export default Versus
