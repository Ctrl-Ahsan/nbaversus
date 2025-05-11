import "./Profile.css"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { signOut } from "firebase/auth"
import { auth } from "../../firebase"

import { FaSignOutAlt, FaUser, FaLock } from "react-icons/fa"
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
    // Unlock conditions
    const isFavoritePropUnlocked = favoritePropPlayer !== undefined
    const isGoatUnlocked = goat !== undefined
    const isFavoritePlayerUnlocked = favorite !== undefined
    const isFavoriteTeamUnlocked = favoriteTeam !== undefined
    const isStreakUnlocked = longestStreak !== undefined

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
                        if (response.data.billingDate) {
                            setBillingDate(response.data.billingDate)
                        }
                        if (response.data.billingLabel) {
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

    const handleLogout = async () => {
        await signOut(auth)
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

    const Panel = ({ unlocked, loading, children, caption }) => {
        if (loading) return <div className="panel shimmerBG"></div>
        if (!unlocked) {
            return (
                <div className="panel locked-panel">
                    <FaLock size={"2em"} />
                    <div className="locked-text">{caption}</div>
                </div>
            )
        }
        return <div className="panel">{children}</div>
    }

    return (
        <section className="profile-container">
            <button className="logout" onClick={handleLogout} title="Sign out">
                <FaSignOutAlt size={"1em"} />
            </button>
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

                    <div className="email">{user.email}</div>
                </div>
                <div className="favorites">
                    <Panel
                        unlocked={isFavoritePropUnlocked}
                        loading={loading}
                        caption="Analyze a player prop"
                    >
                        <div className="image">
                            <img
                                src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${favoritePropId}.png`}
                                alt="goat"
                                className="playerImg"
                            />
                        </div>
                        <div className="info">
                            <div className="profile-heading">Favorite Prop</div>
                            <div>{favoritePropPlayer}</div>
                            <div className="second profile-heading">Stat</div>
                            <div className="prop">
                                {favoritePropStat?.toUpperCase()}
                            </div>
                        </div>
                    </Panel>

                    <Panel
                        unlocked={isPremium}
                        loading={loading || stripeLoading}
                        caption="Upgrade to Premium"
                    >
                        <div className="image">
                            <PiStarFourFill
                                size={"3em"}
                                style={{ color: "#facc15" }}
                            />
                        </div>
                        <div className="info">
                            <div className="profile-heading">Premium</div>
                            <div>
                                <span onClick={handleManage} className="link">
                                    Manage
                                </span>
                            </div>
                            <div className="second profile-heading">
                                {billingLabel}
                            </div>
                            {new Date(billingDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}
                        </div>
                    </Panel>

                    <Panel
                        unlocked={isGoatUnlocked}
                        loading={loading}
                        caption="Vote for the GOAT"
                    >
                        <div className="image">
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
                        </div>
                        <div className="info">
                            <div className="profile-heading">GOAT</div>
                            <div>{goat}</div>
                            <div className="second profile-heading">Votes</div>
                            {goatVotes}
                        </div>
                    </Panel>

                    <Panel
                        unlocked={isStreakUnlocked}
                        loading={loading}
                        caption="Start a streak"
                    >
                        <div className="streak">🔥</div>
                        <div className="info">
                            <div className="profile-heading">
                                Longest Streak
                            </div>
                            {longestStreak}
                            <div className="second profile-heading">
                                Current
                            </div>
                            {streak}
                        </div>
                    </Panel>

                    <Panel
                        unlocked={isFavoritePlayerUnlocked}
                        loading={loading}
                        caption="Complete a Versus round"
                    >
                        <div className="image">
                            <img
                                src={favoriteURL}
                                alt="favorite player"
                                className="playerImg"
                            />
                        </div>
                        <div className="info">
                            <div className="profile-heading">
                                Favorite Player
                            </div>
                            <div>{favorite}</div>
                            <div className="second profile-heading">Votes</div>
                            {favoriteVotes}
                        </div>
                    </Panel>

                    <Panel
                        unlocked={isFavoriteTeamUnlocked}
                        loading={loading}
                        caption="Complete a Versus round"
                    >
                        <div className="image">
                            <img
                                src={favoriteTeamURL}
                                className="playerImg"
                                alt="favorite team"
                            />
                        </div>
                        <div className="info">
                            <div className="profile-heading">Favorite Team</div>
                            {favoriteTeam}
                            <div className="second profile-heading">Votes</div>
                            {favoriteTeamVotes}
                        </div>
                    </Panel>
                </div>
            </div>
        </section>
    )
}

export default Profile
