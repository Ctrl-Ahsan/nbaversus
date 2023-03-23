import axios from "axios"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { AiOutlineClose } from "react-icons/ai"
import { FaMedal, FaCrown } from "react-icons/fa"
import Spinner from "./Spinner"

const Leaderboard = (props) => {
    const [winners, setWinners] = useState([])
    useEffect(() => {
        const setLeaderboard = async () => {
            const votes = await axios.get("/api/votes")
            setWinners(votes.data)
        }
        setLeaderboard()
    }, [])

    function handleClick() {
        props.setMenuOpen(false)
        props.setMenuClosed(true)
        props.setToggleLeaderboard(false)
    }

    const LeaderboardContainer = styled.section`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;

        background: rgba(0, 0, 0, 0.4);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(148, 148, 148, 0.3);

        color: white;
        font-weight: 300;
        height: 50%;
        width: 75%;
        max-width: 740px;
        min-height: 70%;
        padding: 1em;

        display: flex;
        flex-direction: column;

        & .close {
            position: absolute;
            top: 1em;
            right: 1em;
            cursor: pointer;
        }

        & .title {
            font-size: 1.5em;
            font-weight: 700;
            padding: 10px 20px;
            margin-bottom: 0.5em;

            svg {
                font-size: 0.7em;
                margin-right: 5px;
            }
        }

        & .leaderboard {
            background-color: #0000007a;
            border: solid 1px #21212179;
            border-top: none;
            border-radius: 0px 0px 5px 5px;
            padding: 1em 10px;
            padding-top: 0.5em;
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            height: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
        }

        & .headers {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            background-color: #0000007a;
            border: solid 1px #21212179;
            border-bottom: none;
            border-radius: 5px 5px 0px 0px;
            padding: 1em 10px;
            font-family: Roboto Condensed, Roboto, Arial;
            font-weight: 700;
        }

        & .entry {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 400;
            padding: 10px;
        }
    `

    return (
        <LeaderboardContainer>
            <div className="close" onClick={handleClick}>
                <AiOutlineClose />
            </div>
            <div className="title">
                <FaMedal /> Leaderboard
            </div>
            <div className="headers">
                <div>Rank</div>
                <div></div>
                <div>Votes</div>
            </div>
            <div className="leaderboard">
                {winners.length < 1 && <Spinner />}
                {winners !== [] &&
                    winners.map((winner, i) => {
                        return (
                            <React.Fragment key={i}>
                                <div className="entry">
                                    {i === 0 ? <FaCrown color="gold" /> : i + 1}
                                </div>
                                <div
                                    className="entry"
                                    style={{ fontWeight: 700 }}
                                >
                                    {winner[0]}
                                </div>
                                <div className="entry">{winner[1]}</div>
                            </React.Fragment>
                        )
                    })}
            </div>
        </LeaderboardContainer>
    )
}

export default Leaderboard
