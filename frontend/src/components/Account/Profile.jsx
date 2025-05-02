import "./Profile.css"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { signOut } from "firebase/auth"
import { auth } from "../../firebase"

import { FaSignOutAlt, FaUser } from "react-icons/fa"
import { getAuthToken } from "../../utils/getAuthToken"
import { AppContext } from "../../AppContext"

const Profile = () => {
    const { user } = useContext(AppContext)
    const navigate = useNavigate()
    const [goat, setGoat] = useState()
    const [goatVotes, setGoatVotes] = useState()
    const [streak, setStreak] = useState()
    const [longestStreak, setLongestStreak] = useState()
    const [favorite, setFavorite] = useState()
    const [favoriteURL, setFavoriteURL] = useState()
    const [favoriteVotes, setFavoriteVotes] = useState()
    const [favoriteTeam, setFavoriteTeam] = useState()
    const [favoriteTeamURL, setFavoriteTeamURL] = useState()
    const [favoriteTeamVotes, setFavoriteTeamVotes] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        // get me
        const getMe = async () => {
            const token = await getAuthToken(user, navigate)
            axios
                .get("/api/users/me", {
                    headers: { Authorization: "Bearer " + token },
                })
                .then((response) => {
                    if (response.data) {
                        if (response.data.goatVotes) {
                            setGoat(response.data.goat)
                            setGoatVotes(response.data.goatVotes)
                        }
                        if (response.data.longestStreak) {
                            setLongestStreak(response.data.longestStreak)
                            setStreak(response.data.currentStreak)
                        }
                        if (response.data.favoritePlayer) {
                            setFavorite(response.data.favoritePlayer)
                            setFavoriteTeam(response.data.favoriteTeam)
                            setFavoriteVotes(response.data.favoritePlayerVotes)
                            setFavoriteTeamVotes(
                                response.data.favoriteTeamVotes
                            )
                            setFavoriteURL(
                                `https://cdn.nba.com/headshots/nba/latest/1040x760/${response.data.favoritePlayerID}.png`
                            )
                            setFavoriteTeamURL(
                                `https://cdn.nba.com/logos/nba/${response.data.favoriteTeamID}/global/L/logo.svg`
                            )
                        }
                    }
                    setLoading(false)
                })
                .catch(() => {
                    setLoading(false)
                    toast.error("Could not fetch profile")
                })
        }
        getMe()
    }, [])

    const onLogout = async () => {
        await signOut(auth)
        localStorage.removeItem("user")
        localStorage.removeItem("streak")
        localStorage.removeItem("voteTracking")
        localStorage.removeItem("lastUpdated")
    }

    return (
        <section className="profile-container">
            <div className="me">
                <div className="title">
                    <FaUser /> {user.displayName}
                    <div className="votes">{!loading && user.email}</div>
                </div>
                <div className="favorites">
                    <div className={loading ? "panel shimmerBG" : "panel"}>
                        {!loading && (
                            <>
                                <div className="image">
                                    {goat && (
                                        <img
                                            src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${
                                                goat === "LeBron"
                                                    ? 2544
                                                    : goat === "Jordan"
                                                    ? 893
                                                    : 0
                                            }.png`}
                                            alt="goat"
                                            className="playerImg"
                                        />
                                    )}
                                </div>
                                <div>
                                    <div className="profile-heading">GOAT</div>
                                    <div>{goat}</div>
                                    <div
                                        className="profile-heading"
                                        style={{ marginTop: "0.5em" }}
                                    >
                                        Votes
                                    </div>
                                    {goatVotes}
                                </div>
                            </>
                        )}
                    </div>
                    <div className={loading ? "panel shimmerBG" : "panel"}>
                        {!loading && (
                            <>
                                {streak !== undefined ? (
                                    <div className="streak">🔥</div>
                                ) : (
                                    <div className="image"></div>
                                )}
                                <div>
                                    <div className="profile-heading">
                                        Longest Streak
                                    </div>
                                    {longestStreak}
                                    <div
                                        className="profile-heading"
                                        style={{ marginTop: "0.5em" }}
                                    >
                                        Current
                                    </div>
                                    {streak}
                                </div>
                            </>
                        )}
                    </div>
                    <div className={loading ? "panel shimmerBG" : "panel"}>
                        {!loading && (
                            <>
                                <div className="image">
                                    {favoriteURL && (
                                        <img
                                            src={favoriteURL}
                                            alt="favorite player"
                                            className="playerImg"
                                        />
                                    )}
                                </div>
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
                            </>
                        )}
                    </div>
                    <div className={loading ? "panel shimmerBG" : "panel"}>
                        <div className="image">
                            {favoriteTeamURL && !loading && (
                                <img
                                    src={favoriteTeamURL}
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
