import styled from "styled-components"
import axios from "axios"
import { FaSignOutAlt, FaUser } from "react-icons/fa"
import { useEffect, useState } from "react"

const Profile = (props) => {
    const [user, setUser] = useState()
    const [favorite, setFavorite] = useState()
    const [favoriteURL, setFavoriteURL] = useState()
    const [favoriteVotes, setFavoriteVotes] = useState()
    const [favoriteTeam, setFavoriteTeam] = useState()
    const [favoriteTeamURL, setFavoriteTeamURL] = useState()
    const [favoriteTeamVotes, setFavoriteTeamVotes] = useState()

    useEffect(() => {
        if (localStorage.getItem("user") !== null) {
            setUser(JSON.parse(localStorage.getItem("user")).Name)
            // get me
            const token = JSON.parse(localStorage.getItem("user")).Token
            axios
                .get("/api/users/me", {
                    headers: { Authorization: "Bearer " + token },
                })
                .then((response) => {
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
            padding: 0.4em;
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
                margin-right: 5px;
            }
        }

        & .heading {
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
    `

    return (
        <ProfileContainer>
            <div className="me">
                <div className="title">
                    <FaUser /> {user}
                </div>
                <div className="panel" style={{ marginBottom: "0.5em" }}>
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
                        <span className="heading">Favorite Player</span>
                        <br />
                        {favorite}
                        <br />
                        <span className="heading">Votes</span>
                        <br />
                        {favoriteVotes}
                    </div>
                </div>
                <div className="panel">
                    <div className="image">
                        {favoriteTeamURL && (
                            <img
                                src={favoriteTeamURL}
                                alt="favorite team"
                                className="playerImg"
                            />
                        )}
                    </div>
                    <div>
                        <span className="heading">Favorite Team</span>
                        <br />
                        {favoriteTeam}
                        <br />
                        <span className="heading">Votes</span>
                        <br />
                        {favoriteTeamVotes}
                    </div>
                </div>
            </div>
            <button className="logout red" onClick={onLogout}>
                <FaSignOutAlt /> Logout
            </button>
        </ProfileContainer>
    )
}

export default Profile
