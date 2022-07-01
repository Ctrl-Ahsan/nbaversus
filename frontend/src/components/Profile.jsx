import styled from "styled-components"
import axios from "axios"
import { useDispatch } from "react-redux"
import { FaSignOutAlt, FaUser } from "react-icons/fa"
import { logout, reset } from "../features/auth/authSlice"
import { useEffect, useState } from "react"
import Players from "../players.json"

const Profile = () => {
    const [user, setUser] = useState()
    const [favorite, setFavorite] = useState()
    const [favoriteURL, setFavoriteURL] = useState()
    const [favoriteVotes, setFavoriteVotes] = useState()
    const [notFavorite, setNotFavorite] = useState()
    const [notFavoriteURL, setNotFavoriteURL] = useState()
    const [notFavoriteVotes, setNotFavoriteVotes] = useState()

    useEffect(() => {
        if (localStorage.getItem("user") !== null) {
            const token = JSON.parse(localStorage.getItem("user")).Token
            let myVotes
            // get me
            axios
                .get("/api/users/me", {
                    headers: { Authorization: "Bearer " + token },
                })
                .then((response) => {
                    setUser(response.data.name)
                    myVotes = response.data.votes
                })
                .then(() => {
                    // get votes
                    axios.get("/api/votes").then((res) => {
                        for (let i = 0; i < myVotes.length; i++) {
                            for (let j = 0; j < res.data.length; j++) {
                                if (myVotes[i] === res.data[j]._id) {
                                    myVotes[i] = res.data[j]
                                }
                            }
                        }
                        // count winners
                        let winnerCount = {}
                        for (let i = 0; i < myVotes.length; i++) {
                            let property = myVotes[i].winner
                            if (winnerCount.hasOwnProperty(property)) {
                                winnerCount[property] += 1
                            } else {
                                winnerCount[property] = 1
                            }
                        }
                        const winnerArray = Object.entries(winnerCount).sort(
                            (a, b) => b[1] - a[1]
                        )
                        // count losers
                        let loserCount = {}
                        for (let i = 0; i < myVotes.length; i++) {
                            let property = myVotes[i].loser
                            if (loserCount.hasOwnProperty(property)) {
                                loserCount[property] += 1
                            } else {
                                loserCount[property] = 1
                            }
                        }
                        const loserArray = Object.entries(loserCount).sort(
                            (a, b) => a[1] - b[1]
                        )

                        setFavoriteURL(
                            `https://cdn.nba.com/headshots/nba/latest/1040x760/${winnerArray[0][0]}.png`
                        )
                        setNotFavoriteURL(
                            `https://cdn.nba.com/headshots/nba/latest/1040x760/${loserArray[0][0]}.png`
                        )
                        // get real names
                        for (let j = 0; j < Players.playersArray.length; j++) {
                            if (
                                winnerArray[0][0] ===
                                Players.playersArray[j].personId
                            ) {
                                winnerArray[0][0] =
                                    Players.playersArray[j].lastName
                            }
                            if (
                                loserArray[0][0] ===
                                Players.playersArray[j].personId
                            ) {
                                loserArray[0][0] =
                                    Players.playersArray[j].lastName
                            }
                        }
                        setFavorite(winnerArray[0][0])
                        setNotFavorite(loserArray[0][0])
                        setFavoriteVotes(winnerArray[0][1])
                        setNotFavoriteVotes(loserArray[0][1])
                    })
                })
        }
    }, [])

    const dispatch = useDispatch()

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
    }

    const ProfileContainer = styled.div`
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

        & .playerImg {
            display: flex;
            height: 1em;
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
                    <div>
                        {favoriteURL && (
                            <img src={favoriteURL} alt="favorite" />
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
                    <div>
                        {notFavoriteURL && (
                            <img src={notFavoriteURL} alt="least favorite" />
                        )}
                    </div>
                    <div>
                        <span className="heading">Disliked Player</span>
                        <br />
                        {notFavorite}
                        <br />
                        <span className="heading">Against</span>
                        <br />
                        {notFavoriteVotes}
                    </div>
                </div>
            </div>
            <button className="logout" onClick={onLogout}>
                <FaSignOutAlt /> Logout
            </button>
        </ProfileContainer>
    )
}

export default Profile
