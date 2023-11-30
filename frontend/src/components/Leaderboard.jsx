import React, { useEffect, useState } from "react"
import axios from "axios"
import styled from "styled-components"
import { toast } from "react-toastify"

import Spinner from "./Spinner"

import { FaCrown } from "react-icons/fa"
import { GiPodium } from "react-icons/gi"

const Leaderboard = () => {
    const [winners, setWinners] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        const setLeaderboard = async () => {
            const votes = await axios.get("/api/votes").catch((error) => {
                toast.error(error.response.data)
                setLoading(false)
            })
            setWinners(votes.data)
            setLoading(false)
        }
        setLeaderboard()
    }, [])

    const LeaderboardContainer = styled.section`
        background: rgba(0, 0, 0, 0.4);
        border-radius: 16px;
        border: 1px solid rgba(148, 148, 148, 0.3);

        color: white;
        font-weight: 300;
        min-height: 100%;
        height: 100%;
        width: 100%;
        padding: 1em;

        display: flex;
        flex-direction: column;

        & .title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5em;
            font-weight: 700;
            padding: 10px 20px;
            margin-bottom: 0.5em;

            svg {
                margin-right: 0.5em;
                padding-bottom: 0.2em;
            }
        }

        & .leaderboard {
            background-color: #0000007a;
            border: solid 1px #21212179;
            border-top: none;
            border-radius: 0px 0px 5px 5px;
            padding: 1em 0;
            padding-top: 0.5em;
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            height: 100%;
            width: 100%;
            overflow-x: hidden;
            overflow-y: scroll;
            position: relative;
        }

        & .headers {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            background-color: #0000007a;
            border: solid 1px #21212179;
            border-bottom: none;
            border-radius: 5px 5px 0px 0px;
            padding: 1em 0;
            font-family: Bebas Neue, Roboto Condensed, Arial;
            font-weight: 700;
            width: 100%;
        }

        & .entry {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 400;
            padding: 0.6em;
        }
    `

    return (
        <LeaderboardContainer>
            <div className="title">
                <GiPodium /> Leaderboard
            </div>
            <div className="headers">
                <div>Rank</div>
                <div></div>
                <div>Votes</div>
            </div>
            <div className="leaderboard">
                {loading && <Spinner />}
                {!loading &&
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
