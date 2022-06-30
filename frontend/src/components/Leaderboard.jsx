import axios from "axios"
import { useEffect, useState } from "react"
import styled from "styled-components"
import Players from "../players.json"

const Leaderboard = () => {
    const [winners, setWinners] = useState([])
    useEffect(() => {
        const setLeaderboard = async () => {
            const votesJSON = await axios.get("/api/votes")
            let winnerArray = []
            for (let i = 0; i < votesJSON.data.length; i++) {
                winnerArray.push(votesJSON.data[i].winner)
            }
            setWinners(winnerArray)
        }
        setLeaderboard()
    }, [])

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
        min-height: 50%;
        padding: 20px;
        overflow: scroll;
    `

    return (
        <LeaderboardContainer>
            {winners !== [] &&
                winners.map((winner) => {
                    for (let i = 0; i < Players.playersArray.length; i++) {
                        if (winner === Players.playersArray[i].personId) {
                            return (
                                <div>{Players.playersArray[i].firstName}</div>
                            )
                        }
                    }
                })}
        </LeaderboardContainer>
    )
}

export default Leaderboard
