import styled from "styled-components"
import axios from "axios"
import { FaSignOutAlt, FaUser } from "react-icons/fa"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

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
                .catch((error) => {
                    setLoading(false)
                    console.log(error)
                    toast.error(error.response.data)
                })
        }
    }, [])

    const onLogout = () => {
        localStorage.removeItem("user")
        props.setLoggedIn(false)
    }

    const ProfileContainer = styled.div`
        background-color: #0000007a;
        border: solid 1px #21212179;
        border-radius: 5px;
        padding: 1em 10px;
        & .me {
            padding: 1em;
            padding-top: 0;
        }

        & .panel {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            background-color: #d3d3d352;
            border-radius: 20px;
            padding: 0.5em;
            font-weight: 700;

            img {
                height: 5em;
                border-radius: 30px;
            }
        }

        & .title {
            font-size: 1.5em;
            font-weight: 700;
            margin-bottom: 0.5em;

            svg {
                font-size: 0.7em;
            }

            & .votes {
                margin-top: 0.25em;
                height: 1em;
                font-family: Roboto Condensed, Roboto, Arial;
                font-size: 0.5em;
                font-weight: 300;
            }
        }

        & .profile-heading {
            font-weight: 300;
            font-size: 0.7em;
            font-family: Roboto Condensed, Roboto, Arial;
        }

        & .image {
            height: 5em;
        }

        & .playerImg {
            display: flex;
            width: 7em;
        }

        & .logout {
            width: 90%;
        }
        & .button-text {
            display: flex;
            justify-content: center;
            align-items: center;
            & svg {
                margin-right: 0.2em;
            }
        }
    `

    return (
        <ProfileContainer>
            <div className="me">
                <div className="title">
                    <FaUser /> {user}
                    <div className="votes">
                        {!loading &&
                            `Total Votes: ${voteCount ? voteCount : 0}`}
                    </div>
                </div>
                <div
                    className={loading ? "panel shimmerBG" : "panel"}
                    style={{ marginBottom: "0.5em" }}
                >
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
                            <div className="profile-heading">Favorite Team</div>
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
            <button className="logout red" onClick={onLogout}>
                <div className="button-text">
                    <FaSignOutAlt /> Sign Out
                </div>
            </button>
        </ProfileContainer>
    )
}

export default Profile
