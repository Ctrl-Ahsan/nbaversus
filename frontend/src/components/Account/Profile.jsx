import "./Profile.css"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { signOut } from "firebase/auth"
import { auth } from "../../firebase"

import { FaSignOutAlt, FaUser } from "react-icons/fa"
import { PiStarFourFill } from "react-icons/pi"
import { getAuthToken } from "../../utils/getAuthToken"
import { AppContext } from "../../AppContext"

const Profile = () => {
    const { user, isPremium } = useContext(AppContext)
    const navigate = useNavigate()
    const [favoritePropPlayer, setFavoritePropPlayer] = useState()
    const [favoritePropId, setFavoritePropId] = useState()
    const [favoritePropStat, setFavoritePropStat] = useState()
    const [billingDate, setBillingDate] = useState()
    const [billingLabel, setBillingLabel] = useState()
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
    const [stripeLoading, setStripeLoading] = useState(false)

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
                        if (isPremium) {
                            setBillingDate(response.data.billingDate)
                            setBillingLabel(response.data.billingLabel)
                        }
                        if (response.data.favoritePropPlayer) {
                            setFavoritePropPlayer(
                                response.data.favoritePropPlayer
                            )
                            setFavoritePropId(response.data.favoritePropId)
                            setFavoritePropStat(response.data.favoritePropStat)
                        }
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

    const handleManage = async () => {
        if (stripeLoading) return
        try {
            setStripeLoading(true)

            if (!user) {
                toast.warn("Sign in to manage your account.")
                setStripeLoading(false)
                return
            }

            const token = await getAuthToken(user, navigate)
            const res = await fetch("/api/premium/manage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await res.json()

            if (res.ok) {
                window.location.href = data.url
            } else {
                throw new Error(data.error || "Request failed")
            }
        } catch (err) {
            console.error("Checkout error:", err.message)
            toast.error(
                err.message || "Something went wrong. Please try again."
            )
            setStripeLoading(false)
        }
    }

    return (
        <section className="profile-container">
            <div className="me">
                <div className="title">
                    <div className="name">
                        {isPremium ? (
                            <PiStarFourFill
                                size={"1.2em"}
                                style={{ color: "#facc15" }}
                            />
                        ) : (
                            <FaUser />
                        )}{" "}
                        {user.displayName}
                    </div>
                    <div className="email">{!loading && user.email}</div>
                </div>
                <div className="favorites">
                    <div className={loading ? "panel shimmerBG" : "panel"}>
                        {!loading && (
                            <>
                                <div className="image">
                                    {favoritePropId && (
                                        <img
                                            src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${favoritePropId}.png`}
                                            alt="goat"
                                            className="playerImg"
                                        />
                                    )}
                                </div>
                                <div className="info">
                                    <div className="profile-heading">
                                        Favorite Prop
                                    </div>
                                    <div>{favoritePropPlayer}</div>
                                    <div
                                        className="profile-heading"
                                        style={{
                                            marginTop: "0.5em",
                                        }}
                                    >
                                        Stat
                                    </div>
                                    <div className="prop">
                                        {favoritePropStat?.toUpperCase()}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div
                        className={
                            loading || stripeLoading
                                ? "panel shimmerBG"
                                : "panel"
                        }
                    >
                        {!loading && !stripeLoading && (
                            <>
                                {stripeLoading ? (
                                    <div
                                        className="spinner"
                                        style={{ fontSize: "2em" }}
                                    ></div>
                                ) : (
                                    <>
                                        <div className="image">
                                            <PiStarFourFill
                                                size={"3em"}
                                                style={{ color: "#facc15" }}
                                            />
                                        </div>
                                        <div className="info">
                                            <div className="profile-heading">
                                                Premium
                                            </div>
                                            <div>
                                                <a
                                                    onClick={handleManage}
                                                    className="link"
                                                >
                                                    Manage
                                                </a>
                                            </div>
                                            <div
                                                className="profile-heading"
                                                style={{ marginTop: "0.5em" }}
                                            >
                                                {billingLabel}
                                            </div>
                                            {new Date(
                                                billingDate
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
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
                                <div className="info">
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
                                <div className="info">
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
                                <div className="info">
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
                            <div className="info">
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
