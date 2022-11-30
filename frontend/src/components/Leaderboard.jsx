import axios from "axios"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { AiOutlineClose } from "react-icons/ai"
import { FaMedal } from "react-icons/fa"
import Players from "../players.json"

const Leaderboard = (props) => {
    const [winners, setWinners] = useState([])
    useEffect(() => {
        const setLeaderboard = async () => {
            const votesJSON = await axios.get("/api/votes")
            // count individual votes
            let count = {}
            for (let i = 0; i < votesJSON.data.length; i++) {
                let property = votesJSON.data[i].winner
                if (count.hasOwnProperty(property)) {
                    count[property] += 1
                } else {
                    count[property] = 1
                }
            }
            const countArray = Object.entries(count).sort((a, b) => b[1] - a[1])
            // convert IDs to names
            for (let i = 0; i < countArray.length; i++) {
                for (let j = 0; j < Players.playersArray.length; j++) {
                    if (countArray[i][0] === Players.playersArray[j].personId) {
                        countArray[
                            i
                        ][0] = `${Players.playersArray[j].firstName} ${Players.playersArray[j].lastName}`
                        break
                    }
                }
                if (parseInt(countArray[i][0])) {
                    countArray.splice(i, 1)
                    i--
                }
            }
            countArray.length = 50
            setWinners(countArray)
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
        width: 70%;
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
            border-radius: 5px;
            padding: 1em 10px;
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            overflow-x: hidden;
            overflow-y: scroll;
        }

        & .heading {
            font-weight: 300;
            font-family: Roboto Condensed, Roboto, Arial;
        }

        & .entry {
            font-weight: 700;
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
            <div className="leaderboard">
                <div className="heading">Rank</div>
                <div className="heading">Player</div>
                <div className="heading">Votes</div>
                <hr style={{ width: "1em" }} />
                <hr style={{ width: "1em" }} />
                <hr style={{ width: "1em" }} />
                {winners !== [] &&
                    winners.map((winner, i) => {
                        return (
                            <React.Fragment key={i}>
                                <div className="entry">{i + 1}</div>
                                <div className="entry">{winner[0]}</div>
                                <div className="entry">{winner[1]}</div>
                            </React.Fragment>
                        )
                    })}
            </div>
        </LeaderboardContainer>
    )
}

export default Leaderboard
