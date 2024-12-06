import { useEffect, useState, useRef } from "react"
import "./Home.css"
import { teamColors } from "../../config"
import { GiGoat } from "react-icons/gi"
import axios from "axios"
import { toast } from "react-toastify"

const Home = () => {
    const [versus, setVersus] = useState([])
    const [loading, setLoading] = useState(false)
    const streakRef = useRef(parseInt(localStorage.getItem("streak")) || 0)
    const streakDivRef = useRef(null)

    useEffect(() => {
        setLoading(true)
        fetchDailyQuestions()
    }, [])

    const fetchDailyQuestions = async () => {
        try {
            let response
            if (localStorage.getItem("user") !== null) {
                const token = JSON.parse(localStorage.getItem("user")).Token
                response = await axios.get("/api/questions/daily", {
                    headers: { Authorization: "Bearer " + token },
                })
            } else {
                response = await axios.get("/api/questions/daily")
            }

            // Set streak and vote tracking for users
            if (response.data.streak && response.data.voteTracking) {
                localStorage.setItem("streak", response.data.streak)
                localStorage.setItem(
                    "voteTracking",
                    JSON.stringify(response.data.voteTracking)
                )
                streakRef.current = response.data.streak
                updateStreakDisplay()
            }
            // Reset streak and vote tracking for guest users
            else {
                const lastVisitDate = localStorage.getItem("lastUpdated")
                const voteTracking = localStorage.getItem("voteTracking")
                if (!isToday(lastVisitDate) || !voteTracking) {
                    // Reset vote tracking for new day
                    localStorage.setItem("voteTracking", "{}")
                }
                if (!isToday(lastVisitDate) && !isYesterday(lastVisitDate)) {
                    // Reset streak
                    streakRef.current = 0
                    localStorage.setItem("streak", 0)
                    updateStreakDisplay()
                }
            }
            localStorage.setItem(
                "lastUpdated",
                response.data.dailyQuestions.date
            )
            setVersus(response.data.dailyQuestions.questions)
            setLoading(false)
        } catch (error) {
            toast.error("Error fetching daily questions")
            console.error("Error fetching daily questions:", error)
            setLoading(false)
        }
    }

    const incrementStreak = () => {
        try {
            const lastVisitDate = localStorage.getItem("lastUpdated")

            if (isToday(lastVisitDate) || isYesterday(lastVisitDate)) {
                // Increment streak
                streakRef.current += 1
                localStorage.setItem("streak", streakRef.current)
                updateStreakDisplay()
            } else {
                // Reset streak if user missed a day
                streakRef.current = 0
                localStorage.setItem("streak", 0)
                updateStreakDisplay()
            }
        } catch (error) {
            toast.error("Error updating streak")
            console.error("Error updating streak:", error)
        }
    }

    const isToday = (date) => {
        const today = new Date().toISOString().split("T")[0] // Current UTC date
        return date === today
    }

    const isYesterday = (date) => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        return date === yesterday.toISOString().split("T")[0]
    }

    const handleVote = (questionIndex, winner) => {
        // Increment streak on first vote of the day
        if (localStorage.getItem("voteTracking") === "{}") {
            incrementStreak()
        }
        const cachedVotes = JSON.parse(localStorage.getItem("voteTracking"))
        const updatedVotes = { ...cachedVotes, [questionIndex]: winner }
        localStorage.setItem("voteTracking", JSON.stringify(updatedVotes)) // Save to local storage

        // Send vote
        if (localStorage.getItem("user") !== null) {
            const token = JSON.parse(localStorage.getItem("user")).Token
            axios
                .post(
                    "/api/questions/daily",
                    {
                        date: new Date().toISOString().split("T")[0],
                        questionIndex: questionIndex,
                        winner: winner,
                    },
                    {
                        headers: { Authorization: "Bearer " + token },
                    }
                )
                .catch((error) => {
                    toast.error(error.response.data)
                })
        } else {
            axios
                .post("/api/questions/daily", {
                    date: new Date().toISOString().split("T")[0],
                    questionIndex: questionIndex,
                    winner: winner,
                })
                .catch((error) => {
                    toast.error(error.response.data)
                })
        }
    }

    const updateStreakDisplay = () => {
        if (streakDivRef.current) {
            streakDivRef.current.textContent = `${streakRef.current} 🔥` // Update DOM content directly
        }
    }

    const Streak = () => {
        useEffect(() => {
            updateStreakDisplay()
        }, [])

        return <div ref={streakDivRef} className="streak"></div> // Assign ref to the div
    }

    const Refresh = () => {
        // Function to calculate time left until 12am UTC
        const calculateTimeLeft = () => {
            const now = new Date()
            const nextMidnight = new Date(now)
            nextMidnight.setUTCDate(now.getUTCDate() + 1) // Move to the next day
            nextMidnight.setUTCHours(0, 0, 0, 0) // Set time to 12am UTC

            const diff = nextMidnight - now // Difference in milliseconds
            const hours = Math.floor(diff / (1000 * 60 * 60)) + 1

            return hours
        }

        const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

        useEffect(() => {
            // Update the time left every second
            const interval = setInterval(() => {
                const timeLeft = calculateTimeLeft()
                if (timeLeft === 0) {
                    fetchDailyQuestions()
                }
                setTimeLeft(timeLeft)
            }, 1000)

            // Cleanup the interval on component unmount
            return () => clearInterval(interval)
        }, [])

        return <div className="refresh">{timeLeft}H ⏳</div>
    }

    const Panel = ({ players, votes, questionIndex }) => {
        const cachedVotes = JSON.parse(localStorage.getItem("voteTracking"))
        const [voted, setVoted] = useState(!!cachedVotes[questionIndex])
        const [animate, setAnimate] = useState(false)
        const [p1Wins, setP1Wins] = useState(
            cachedVotes[questionIndex] === "p1"
        )
        const [p2Wins, setP2Wins] = useState(
            cachedVotes[questionIndex] === "p2"
        )
        const [votes1, setVotes1] = useState(
            p1Wins && votes.player1 === 0 ? 1 : votes.player1
        )
        const [votes2, setVotes2] = useState(
            p2Wins && votes.player2 === 0 ? 1 : votes.player2
        )

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
                setAnimate(true)
                setP1Wins(true)
                handleVote(questionIndex, "p1")
            }
        }
        const handleClick2 = () => {
            if (!p1Wins && !p2Wins) {
                setVotes2(votes2 + 1)
                setVoted(true)
                setAnimate(true)
                setP2Wins(true)
                handleVote(questionIndex, "p2")
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
                        className={`votes ${animate ? "puff-in-center" : ""}`}
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
                        className={`votes ${animate ? "puff-in-center" : ""}`}
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
            <Streak />
            <Refresh />
            <div className="content">
                {loading ? (
                    <>
                        <div className="blank shimmerBG"></div>
                        <div className="blank shimmerBG"></div>
                        <div className="blank shimmerBG"></div>
                        <div className="blank shimmerBG"></div>
                        <div className="blank shimmerBG"></div>
                        <div className="blank shimmerBG"></div>
                    </>
                ) : (
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
                                questionIndex={index}
                            />
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}

export default Home
