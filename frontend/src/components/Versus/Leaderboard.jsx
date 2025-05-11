import "./Leaderboard.css"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

import Spinner from "../Spinner/Spinner"

import { AiOutlineClose } from "react-icons/ai"
import { FaCrown } from "react-icons/fa"

const Leaderboard = (props) => {
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

    function handleClick() {
        props.setMenuOpen(false)
        props.setMenuClosed(true)
        props.setLeaderboard(false)
    }

    return (
        <section className="leaderboard-container">
            <div className="close" onClick={handleClick}>
                <AiOutlineClose />
            </div>
            <div className="title">Leaderboard</div>
            <div className="headers">
                <div>Rank</div>
                <div></div>
                <div>Wins</div>
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
        </section>
    )
}

export default Leaderboard
