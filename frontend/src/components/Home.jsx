import { useEffect, useState } from "react"
import "./Home.css"
import { teamColors } from "../config"
import { GiGoat } from "react-icons/gi"
import axios from "axios"
import { toast } from "react-toastify"

const Home = () => {
    const [versus, setVersus] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        const isSameDay = (cachedDate) => {
            const today = new Date().toISOString().split("T")[0] // Current UTC date
            return cachedDate === today
        }

        const loadFromCache = () => {
            const cachedDate = localStorage.getItem("lastUpdated")
            const cachedQuestions = JSON.parse(
                localStorage.getItem("dailyQuestions")
            )

            if (cachedQuestions && isSameDay(cachedDate)) {
                setVersus(cachedQuestions.questions) // Use cached questions for instant display
            }
        }

        const fetchDailyQuestions = async () => {
            try {
                const { data } = await axios.get("/api/questions/daily")
                // Save to local storage
                localStorage.setItem("lastUpdated", data.date)
                localStorage.setItem("dailyQuestions", JSON.stringify(data))
                setVersus(data.questions)
            } catch (error) {
                toast.error("Error fetching daily questions")
                console.error("Error fetching daily questions:", error)
            } finally {
                setLoading(false)
            }
        }
        loadFromCache()
        fetchDailyQuestions()
    }, [])

    const Panel = ({ players, votes }) => {
        const [voted, setVoted] = useState(false)
        const [p1Wins, setP1Wins] = useState(false)
        const [p2Wins, setP2Wins] = useState(false)
        const [votes1, setVotes1] = useState(votes.player1)
        const [votes2, setVotes2] = useState(votes.player2)

        const player1 = players.player1
        const player2 = players.player2
        const totalVotes = votes1 + votes2

        // Calculate percentages only when there are votes
        const percentage1 =
            totalVotes === 0 ? 0 : Math.round((votes1 / totalVotes) * 100)
        const percentage2 = totalVotes === 0 ? 0 : 100 - percentage1

        // Dynamically calculate widths
        const width1 = voted
            ? percentage1 > percentage2
                ? percentage1 + 30
                : 50
            : 50
        const width2 = voted
            ? percentage2 > percentage1
                ? percentage2 + 30
                : 50
            : 50

        const img1 = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player1.personId}.png`
        const img2 = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player2.personId}.png`
        const logo1 = `https://cdn.nba.com/logos/nba/${player1.teamId}/global/L/logo.svg`
        const logo2 = `https://cdn.nba.com/logos/nba/${player2.teamId}/global/L/logo.svg`
        const bg1 = teamColors[player1.teamId]
        const bg2 = teamColors[player2.teamId]

        // Extract first and last names
        const fullName1 = player1.name
        const lastName1 = fullName1.split(" ").slice(-1).join(" ")
        const fullName2 = player2.name
        const lastName2 = fullName2.split(" ").slice(-1).join(" ")

        // Decide name display based on width
        const displayName1 = width1 - width2 > -69 ? fullName1 : lastName1
        const displayName2 = width2 - width1 > -69 ? fullName2 : lastName2

        const handleClick1 = () => {
            if (!p1Wins && !p2Wins) {
                setVotes1(votes1 + 1)
                setVoted(true)
                setP1Wins(true)
            }
        }
        const handleClick2 = () => {
            if (!p1Wins && !p2Wins) {
                setVotes2(votes2 + 1)
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
                        {`${percentage1}%`}
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
                        {`${percentage2}%`}
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
                {loading && (
                    <>
                        <div className="blank shimmerBG"></div>
                        <div className="blank shimmerBG"></div>
                        <div className="blank shimmerBG"></div>
                        <div className="blank shimmerBG"></div>
                        <div className="blank shimmerBG"></div>
                        <div className="blank shimmerBG"></div>
                    </>
                )}
                {!loading &&
                    versus?.map((category, index) => (
                        <div className="versus" key={index}>
                            <div className="category">
                                {category.question}
                                {category.question === "GOAT" ? <GiGoat /> : ""}
                            </div>
                            <Panel
                                players={category.players}
                                votes={category.votes}
                                key={`${category.category}-${index}`}
                            />
                        </div>
                    ))}
            </div>
        </main>
    )
}

export default Home
