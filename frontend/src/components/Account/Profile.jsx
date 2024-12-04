import "./Profile.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

import { FaSignOutAlt, FaUser } from "react-icons/fa"

const Profile = (props) => {
    const [user, setUser] = useState()
    const [voteCount, setVoteCount] = useState()
    const [favorite, setFavorite] = useState()
    const [favoriteURL, setFavoriteURL] = useState()
    const [favoriteVotes, setFavoriteVotes] = useState()
    const [favoriteTeam, setFavoriteTeam] = useState()
    const [favoriteTeamURL, setFavoriteTeamURL] = useState()
    const [favoriteTeamVotes, setFavoriteTeamVotes] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (localStorage.getItem("user") !== null) {
            setUser(JSON.parse(localStorage.getItem("user")).Name)
            setLoading(true)
            // get me
            const token = JSON.parse(localStorage.getItem("user")).Token
            axios
                .get("/api/users/me", {
                    headers: { Authorization: "Bearer " + token },
                })
                .then((response) => {
                    setLoading(false)
                    if (response.data.favoritePlayer) {
                        setVoteCount(response.data.voteCount)
                        setFavorite(response.data.favoritePlayer)
                        setFavoriteTeam(response.data.favoriteTeam)
                        setFavoriteVotes(response.data.favoritePlayerVotes)
                        setFavoriteTeamVotes(response.data.favoriteTeamVotes)
                        setFavoriteURL(
                            `https://cdn.nba.com/headshots/nba/latest/1040x760/${response.data.favoritePlayerID}.png`
                        )
                        setFavoriteTeamURL(
                            `https://cdn.nba.com/logos/nba/${response.data.favoriteTeamID}/global/L/logo.svg`
                        )
                    }
                })
                .catch(() => {
                    setLoading(false)
                    toast.error("You have been signed out")
                    localStorage.removeItem("user")
                    props.setLoggedIn(false)
                })
        }
    }, [])

    const onLogout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("streak")
        localStorage.removeItem("voteTracking")
        localStorage.removeItem("lastUpdated")
        props.setLoggedIn(false)
    }

    return (
        <section className="profile-container">
            <div className="me">
                <div className="title">
                    <FaUser /> {user}
                    <div className="votes">
                        {!loading &&
                            `Total Votes: ${voteCount ? voteCount : 0}`}
                    </div>
                </div>
                <div className="favorites">
                    <div className={loading ? "panel shimmerBG" : "panel"}>
                        <div className="image">
                            {favoriteURL && (
                                <img
                                    src={favoriteURL}
                                    alt="favorite player"
                                    className="playerImg"
                                />
                            )}
                        </div>
                        {!loading && (
                            <div>
                                <div className="profile-heading">
                                    Favorite Player
                                </div>
                                <div>{favorite}</div>
                                <div
                                    className="profile-heading"
                                    style={{ marginTop: "0.5em" }}
                                >
                                    Votes
                                </div>
                                {favoriteVotes}
                            </div>
                        )}
                    </div>
                    <div className={loading ? "panel shimmerBG" : "panel"}>
                        <div className="image">
                            {favoriteTeamURL && !loading && (
                                <img
                                    src={favoriteTeamURL}
                                    alt="favorite team"
                                    className="playerImg"
                                />
                            )}
                        </div>
                        {!loading && (
                            <div>
                                <div className="profile-heading">
                                    Favorite Team
                                </div>
                                {favoriteTeam}
                                <div
                                    className="profile-heading"
                                    style={{ marginTop: "0.5em" }}
                                >
                                    Votes
                                </div>
                                {favoriteTeamVotes}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <button className="logout red" onClick={onLogout}>
                <div className="button-text">
                    <FaSignOutAlt /> Sign Out
                </div>
            </button>
        </section>
    )
}

export default Profile
