import { useEffect } from "react"
import axios from "axios"
import "./Home.css"
import { toast } from "react-toastify"
import { useState } from "react"
import { teamColors } from "../config"

const Home = () => {
    const [versus, setVersus] = useState([])
    useEffect(() => {
        const response = [
            {
                category: "GOAT",
                players: [
                    {
                        name: "LeBron James",
                        personId: 2544,
                        teamId: 1610612747,
                        votes: 22,
                    },
                    {
                        name: "Stephen Curry",
                        personId: 201939,
                        teamId: 1610612744,
                        votes: 8,
                    },
                ],
            },
            {
                category: "Shooting",
                players: [
                    {
                        name: "LeBron James",
                        personId: 2544,
                        teamId: 1610612747,
                        votes: 2,
                    },
                    {
                        name: "Stephen Curry",
                        personId: 201939,
                        teamId: 1610612744,
                        votes: 8,
                    },
                ],
            },
        ]
        setVersus(response)
    }, [])

    const Panel = (props) => {
        const [voted, setVoted] = useState(false)
        const votes1 = props.question.players[0].votes
        const votes2 = props.question.players[1].votes
        const totalVotes = votes1 + votes2
        const percentage1 = Math.round((votes1 / totalVotes) * 100)
        const percentage2 = 100 - percentage1
        const width1 = voted
            ? percentage1 > percentage2
                ? percentage1 + 50
                : 50
            : 50
        const width2 = voted
            ? percentage2 > percentage1
                ? percentage2 + 50
                : 50
            : 50

        const handleClick = () => {
            setVoted(true)
        }
        return (
            <div className="panel">
                <div
                    className="player"
                    style={{
                        backgroundColor: `${
                            teamColors[props.question.players[0].teamId]
                        }`,
                        width: `${width1}%`,
                    }}
                    onClick={handleClick}
                >
                    <div className="name">{props.question.players[0].name}</div>
                    <div
                        className="votes"
                        style={{ opacity: voted ? "100%" : "0%" }}
                    >
                        {percentage1}%
                    </div>
                    <div className="image">
                        <img
                            src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${props.question.players[0].personId}.png`}
                        />
                    </div>
                    <img
                        className="logoBG"
                        src={`https://cdn.nba.com/logos/nba/${props.question.players[0].teamId}/global/L/logo.svg`}
                        alt=""
                    />
                </div>
                <div
                    className="player"
                    style={{
                        backgroundColor: `${
                            teamColors[props.question.players[1].teamId]
                        }`,
                        width: `${width2}`,
                    }}
                    onClick={handleClick}
                >
                    <div className="name">{props.question.players[1].name}</div>
                    <div
                        className="votes"
                        style={{ opacity: voted ? "100%" : "0%" }}
                    >
                        {percentage2}%
                    </div>
                    <div className="image">
                        <img
                            src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${props.question.players[1].personId}.png`}
                        />
                    </div>
                    <img
                        className="logoBG"
                        src={`https://cdn.nba.com/logos/nba/${props.question.players[1].teamId}/global/L/logo.svg`}
                        alt=""
                    />
                </div>
            </div>
        )
    }

    return (
        <main className="home">
            <div className="logo">
                NBA
                <img src="/nbaversus.png" alt="" />
            </div>
            <div className="content">
                {versus.map((question) => (
                    <div className="versus">
                        <div className="category">{question.category}</div>
                        <Panel question={question} />
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Home
