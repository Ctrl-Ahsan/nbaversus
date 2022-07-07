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
    const [favoriteTeam, setFavoriteTeam] = useState()
    const [favoriteTeamURL, setFavoriteTeamURL] = useState()
    const [favoriteTeamVotes, setFavoriteTeamVotes] = useState()

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
                        let teamCount = {}
                        for (let i = 0; i < myVotes.length; i++) {
                            let property = myVotes[i].winner
                            if (winnerCount.hasOwnProperty(property)) {
                                winnerCount[property] += 1
                            } else {
                                winnerCount[property] = 1
                            }

                            property = myVotes[i].winnerTeam
                            if (teamCount.hasOwnProperty(property)) {
                                teamCount[property] += 1
                            } else {
                                teamCount[property] = 1
                            }
                        }
                        const winnerArray = Object.entries(winnerCount).sort(
                            (a, b) => b[1] - a[1]
                        )
                        const teamArray = Object.entries(teamCount).sort(
                            (a, b) => b[1] - a[1]
                        )

                        setFavoriteURL(
                            `https://cdn.nba.com/headshots/nba/latest/1040x760/${winnerArray[0][0]}.png`
                        )
                        setFavoriteTeamURL(
                            `https://cdn.nba.com/logos/nba/${teamArray[0][0]}/global/L/logo.svg`
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
                        }
                        while (parseInt(winnerArray[0][0])) {
                            console.log("in while statement")
                            winnerArray.shift()
                            for (
                                let j = 0;
                                j < Players.playersArray.length;
                                j++
                            ) {
                                if (
                                    winnerArray[0][0] ===
                                    Players.playersArray[j].personId
                                ) {
                                    setFavoriteURL(
                                        `https://cdn.nba.com/headshots/nba/latest/1040x760/${winnerArray[0][0]}.png`
                                    )
                                    winnerArray[0][0] =
                                        Players.playersArray[j].lastName
                                }
                            }
                        }
                        switch (teamArray[0][0]) {
                            case "1610612738":
                                teamArray[0][0] = "Celtics"
                                break
                            case "1610612751":
                                teamArray[0][0] = "Nets"
                                break
                            case "1610612752":
                                teamArray[0][0] = "Knicks"
                                break
                            case "1610612755":
                                teamArray[0][0] = "Sixers"
                                break
                            case "1610612761":
                                teamArray[0][0] = "Raptors"
                                break
                            case "1610612741":
                                teamArray[0][0] = "Bulls"
                                break
                            case "1610612739":
                                teamArray[0][0] = "Cavaliers"
                                break
                            case "1610612765":
                                teamArray[0][0] = "Pistons"
                                break
                            case "1610612754":
                                teamArray[0][0] = "Pacers"
                                break
                            case "1610612749":
                                teamArray[0][0] = "Bucks"
                                break
                            case "1610612737":
                                teamArray[0][0] = "Hawks"
                                break
                            case "1610612766":
                                teamArray[0][0] = "Hornets"
                                break
                            case "1610612748":
                                teamArray[0][0] = "Heat"
                                break
                            case "1610612753":
                                teamArray[0][0] = "Magic"
                                break
                            case "1610612764":
                                teamArray[0][0] = "Wizards"
                                break
                            case "1610612743":
                                teamArray[0][0] = "Nuggets"
                                break
                            case "1610612750":
                                teamArray[0][0] = "Timberwolves"
                                break
                            case "1610612760":
                                teamArray[0][0] = "Thunder"
                                break
                            case "1610612757":
                                teamArray[0][0] = "Trail Blazers"
                                break
                            case "1610612762":
                                teamArray[0][0] = "Jazz"
                                break
                            case "1610612744":
                                teamArray[0][0] = "Warriors"
                                break
                            case "1610612746":
                                teamArray[0][0] = "Clippers"
                                break
                            case "1610612747":
                                teamArray[0][0] = "Lakers"
                                break
                            case "1610612756":
                                teamArray[0][0] = "Suns"
                                break
                            case "1610612758":
                                teamArray[0][0] = "Kings"
                                break
                            case "1610612742":
                                teamArray[0][0] = "Mavericks"
                                break
                            case "1610612745":
                                teamArray[0][0] = "Rockets"
                                break
                            case "1610612763":
                                teamArray[0][0] = "Grizzlies"
                                break
                            case "1610612740":
                                teamArray[0][0] = "Pelicans"
                                break
                            case "1610612759":
                                teamArray[0][0] = "Spurs"
                                break
                            default:
                                break
                        }
                        setFavorite(winnerArray[0][0])
                        setFavoriteTeam(teamArray[0][0])
                        setFavoriteVotes(winnerArray[0][1])
                        setFavoriteTeamVotes(teamArray[0][1])
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
                    <div>
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
                    <div>
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
            <button className="logout" onClick={onLogout}>
                <FaSignOutAlt /> Logout
            </button>
        </ProfileContainer>
    )
}

export default Profile
