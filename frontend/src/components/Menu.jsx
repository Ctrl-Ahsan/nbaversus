import styled from "styled-components"
import {
    IoReloadCircle,
    IoInformationCircle,
    IoArrowForwardCircle,
} from "react-icons/io5"
import { FaRegUserCircle } from "react-icons/fa"
import { GiPodium } from "react-icons/gi"

const Menu = (props) => {
    const handleReload = () => {
        // reset states
        props.setRound(1)
        props.setP1Wins(false)
        props.setP2Wins(false)
        props.setSeenPlayers([])
        props.setMenuOpen(false)
        props.setMenuClosed(false)
        // set random players
        let randomInt1 = Math.floor(Math.random() * props.playerArray.length)
        let randomInt2 = Math.floor(Math.random() * props.playerArray.length)
        while (randomInt2 === randomInt1) {
            randomInt2 = Math.floor(Math.random() * props.playerArray.length)
        }
        props.setPlayer1(props.playerArray[randomInt1])
        props.setPlayer2(props.playerArray[randomInt2])
    }
    const handleNext = () => {
        // reset states
        props.setMenuOpen(false)
        props.setMenuClosed(false)
        // increment round
        if (props.round < 5) props.setRound((prevRound) => prevRound + 1)
        else props.setRound(1)
        // set random player(s)
        if (props.round === 5) {
            let randomInt1 = Math.floor(
                Math.random() * props.playerArray.length
            )
            let randomInt2 = Math.floor(
                Math.random() * props.playerArray.length
            )
            while (randomInt2 === randomInt1) {
                randomInt2 = Math.floor(
                    Math.random() * props.playerArray.length
                )
            }
            props.setPlayer1(props.playerArray[randomInt1])
            props.setPlayer2(props.playerArray[randomInt2])
            props.setP1Wins(false)
            props.setP2Wins(false)
            props.setSeenPlayers([])
        } else {
            if (props.p1Wins) {
                let randomInt = Math.floor(
                    Math.random() * props.playerArray.length
                )
                while (
                    props.player1 === props.playerArray[randomInt] ||
                    props.seenPlayers.includes(
                        props.playerArray[randomInt].personId.toString()
                    )
                ) {
                    randomInt = Math.floor(
                        Math.random() * props.playerArray.length
                    )
                }
                props.setPlayer2(props.playerArray[randomInt])
                props.setP1Wins(false)
                props.setP2Wins(false)
            } else if (props.p2Wins) {
                let randomInt = Math.floor(
                    Math.random() * props.playerArray.length
                )
                while (
                    props.player2 === props.playerArray[randomInt] ||
                    props.seenPlayers.includes(
                        props.playerArray[randomInt].personId.toString()
                    )
                ) {
                    randomInt = Math.floor(
                        Math.random() * props.playerArray.length
                    )
                }
                props.setPlayer1(props.playerArray[randomInt])
                props.setP1Wins(false)
                props.setP2Wins(false)
            }
        }
    }

    const handleStats = () => {
        props.setMenuOpen(true)
        props.setToggleStats(true)
    }
    const handleLeaderboard = () => {
        props.setMenuOpen(true)
        props.setToggleLeaderboard(true)
    }
    const handleUser = () => {
        props.setMenuOpen(true)
        props.setToggleUser(true)
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

        ${props.menuOpen ? "display: none;" : ""}

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
            {!props.p1Wins && !props.p2Wins ? (
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
