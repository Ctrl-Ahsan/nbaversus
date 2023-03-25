import { useContext } from "react"
import styled from "styled-components"
import {
    IoReloadCircle,
    IoInformationCircle,
    IoArrowForwardCircle,
} from "react-icons/io5"
import { FaRegUserCircle } from "react-icons/fa"
import { GiPodium } from "react-icons/gi"
import { AppContext } from "../AppContext"
import playerArray from "../players.json"

const Menu = () => {
    const {
        player1,
        setPlayer1,
        player2,
        setPlayer2,
        p1Wins,
        setP1Wins,
        p2Wins,
        setP2Wins,
        seenPlayers,
        setSeenPlayers,
        round,
        setRound,
        menuOpen,
        setMenuOpen,
        setMenuClosed,
        setToggleStats,
        setToggleLeaderboard,
        setToggleUser,
    } = useContext(AppContext)
    const handleReload = () => {
        // reset states
        setRound(1)
        setP1Wins(false)
        setP2Wins(false)
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
        if (round < 5) setRound((prevRound) => prevRound + 1)
        else setRound(1)
        // set random player(s)
        if (round === 5) {
            let randomInt1 = Math.floor(Math.random() * playerArray.length)
            let randomInt2 = Math.floor(Math.random() * playerArray.length)
            while (randomInt2 === randomInt1) {
                randomInt2 = Math.floor(Math.random() * playerArray.length)
            }
            setPlayer1(playerArray[randomInt1])
            setPlayer2(playerArray[randomInt2])
            setP1Wins(false)
            setP2Wins(false)
            setSeenPlayers([])
        } else {
            if (p1Wins) {
                let randomInt = Math.floor(Math.random() * playerArray.length)
                while (
                    player1 === playerArray[randomInt] ||
                    seenPlayers.includes(
                        playerArray[randomInt].personId.toString()
                    )
                ) {
                    randomInt = Math.floor(Math.random() * playerArray.length)
                }
                setPlayer2(playerArray[randomInt])
                setP1Wins(false)
                setP2Wins(false)
            } else if (p2Wins) {
                let randomInt = Math.floor(Math.random() * playerArray.length)
                while (
                    player2 === playerArray[randomInt] ||
                    seenPlayers.includes(
                        playerArray[randomInt].personId.toString()
                    )
                ) {
                    randomInt = Math.floor(Math.random() * playerArray.length)
                }
                setPlayer1(playerArray[randomInt])
                setP1Wins(false)
                setP2Wins(false)
            }
        }
    }

    const handleStats = () => {
        setMenuOpen(true)
        setToggleStats(true)
    }
    const handleLeaderboard = () => {
        setMenuOpen(true)
        setToggleLeaderboard(true)
    }
    const handleUser = () => {
        setMenuOpen(true)
        setToggleUser(true)
    }

    const MenuContainer = styled.nav`
        display: flex;
        flex-direction: column;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 3;
        align-items: center;
        margin-right: 0.5em;
        margin-bottom: 2em;
        font-size: 0.8rem;

        @media screen and (min-width: 320px) {
            font-size: 1em;
        }

        & svg {
            cursor: pointer;
            margin-bottom: 2.5px;
            transition: all 0.3s;
            -webkit-tap-highlight-color: transparent;

            :hover {
                scale: 1.1;
            }
            :active {
                scale: 0.9;
                color: #bd7b00 !important;
            }
        }
    `

    return (
        <MenuContainer>
            {!p1Wins && !p2Wins ? (
                <IoReloadCircle
                    onClick={handleReload}
                    style={{
                        color: "orange",
                        fontSize: "5em",
                        marginBottom: "0.2em",
                    }}
                />
            ) : (
                <IoArrowForwardCircle
                    className="scale-in-center"
                    onClick={handleNext}
                    style={{
                        color: "orange",
                        fontSize: "5em",
                        marginBottom: "0.2em",
                    }}
                />
            )}
            <IoInformationCircle
                onClick={handleStats}
                style={{ fontSize: "2.5em" }}
            />
            <GiPodium
                onClick={handleLeaderboard}
                style={{ fontSize: "2.5em" }}
            />
            <FaRegUserCircle
                onClick={handleUser}
                style={{ fontSize: "2.2em", marginTop: "0.4em" }}
            />
        </MenuContainer>
    )
}

export default Menu
