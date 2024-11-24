import { useEffect, useState } from "react"
import "./Home.css"
import { teamColors } from "../config"
import { GiGoat } from "react-icons/gi"

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
                        name: "Michael Jordan",
                        personId: 893,
                        teamId: 1610612741,
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

    const Panel = ({ question }) => {
        const [voted, setVoted] = useState(false)
        const [p1Wins, setP1Wins] = useState(false)
        const [p2Wins, setP2Wins] = useState(false)

        const votes1 = question.players[0].votes
        const votes2 = question.players[1].votes
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

        const img1 = `https://cdn.nba.com/headshots/nba/latest/1040x760/${question.players[0].personId}.png`
        const img2 = `https://cdn.nba.com/headshots/nba/latest/1040x760/${question.players[1].personId}.png`
        const logo1 = `https://cdn.nba.com/logos/nba/${question.players[0].teamId}/global/L/logo.svg`
        const logo2 = `https://cdn.nba.com/logos/nba/${question.players[1].teamId}/global/L/logo.svg`
        const bg1 = teamColors[question.players[0].teamId]
        const bg2 = teamColors[question.players[1].teamId]

        // Extract first and last names
        const fullName1 = question.players[0].name
        const lastName1 = fullName1.split(" ").slice(-1).join(" ")
        const fullName2 = question.players[1].name
        const lastName2 = fullName2.split(" ").slice(-1).join(" ")

        // Decide name display based on width
        const displayName1 = width1 - width2 > -69 ? fullName1 : lastName1
        const displayName2 = width2 - width1 > -69 ? fullName2 : lastName2

        const handleClick1 = () => {
            if (!p1Wins && !p2Wins) {
                setVoted(true)
                setP1Wins(true)
            }
        }
        const handleClick2 = () => {
            if (!p1Wins && !p2Wins) {
                setVoted(true)
                setP2Wins(true)
            }
        }

        return (
            <div className="panel">
                <div
                    className="player"
                    style={{
                        backgroundColor: bg1,
                        width: `${width1}%`,
                        filter: `${p2Wins ? "brightness(30%)" : ""}`,
                        cursor: `${p1Wins || p2Wins ? "" : "pointer"}`,
                    }}
                    onClick={handleClick1}
                >
                    <div className="name" title={fullName1}>
                        {displayName1}
                    </div>
                    <div
                        className={`votes ${voted ? "puff-in-center" : ""}`}
                        style={{ opacity: voted ? "100%" : "0%" }}
                    >
                        {percentage1}%
                    </div>
                    <div className="image">
                        <img src={img1} />
                    </div>
                    <img className="logoBG" src={logo1} alt="" />
                </div>
                <div
                    className="player"
                    style={{
                        backgroundColor: bg2,
                        width: `${width2}%`,
                        filter: `${p1Wins ? "brightness(30%)" : ""}`,
                        cursor: `${p1Wins || p2Wins ? "" : "pointer"}`,
                    }}
                    onClick={handleClick2}
                >
                    <div className="name" title={fullName2}>
                        {displayName2}
                    </div>
                    <div
                        className={`votes ${voted ? "puff-in-center" : ""}`}
                        style={{ opacity: voted ? "100%" : "0%" }}
                    >
                        {percentage2}%
                    </div>
                    <div className="image">
                        <img src={img2} />
                    </div>
                    <img className="logoBG" src={logo2} alt="" />
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
                {versus.map((question, index) => (
                    <div className="versus" key={index}>
                        <div className="category">
                            {question.category}
                            {question.category === "GOAT" ? <GiGoat /> : ""}
                        </div>
                        <Panel
                            question={question}
                            key={`${question.category}-${index}`}
                        />
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Home
