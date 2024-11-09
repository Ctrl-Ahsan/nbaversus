import { useEffect } from "react"
import axios from "axios"
import styled from "styled-components"
import { toast } from "react-toastify"

import Leaderboard from "./Leaderboard"

import { FaHeart, FaGithub, FaFire } from "react-icons/fa"
import { useState } from "react"
import { FaMedal } from "react-icons/fa6"
import Spinner from "./Spinner"

const Home = () => {
    const [leaders, setLeaders] = useState({})
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        const getLeaders = async () => {
            const leadersResponse = await axios
                .get("/api/stats/leaders")
                .catch((error) => {
                    toast.error(error.response.data)
                    setLoading(false)
                })
            setLoading(false)
            try {
                setLeaders(leadersResponse.data)
            } catch (error) {
                toast.error(error)
            }
        }
        getLeaders()
    }, [])

    const Entry = (props) => {
        const imageUrl = `https://cdn.nba.com/headshots/nba/latest/260x190/${props.entry[0]}.png`

        return (
            <div className="entry">
                <div className="image">
                    <img src={imageUrl} alt="" />
                </div>
                <div className="name">{props.entry[1]}</div>
                <div className="stat">{props.entry[2]}</div>
            </div>
        )
    }

    const HomeContainer = styled.section`
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 92%;
        width: 100%;
        max-height: -webkit-fill-available;
        overflow-y: scroll;

        background: linear-gradient(270deg, #860000, #013a6b);

        @media screen and (min-width: 1080px) {
            height: 100%;
        }
        & .logo {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 0.5em 0;
            font-family: Bebas Neue, Roboto, Arial, Helvetica, sans-serif;
            font-size: 4em;

            img {
                margin-top: -12px;
                width: 1.25em;
                -webkit-touch-callout: none;
                -webkit-tap-highlight-color: transparent;
                -moz-user-select: none;
                -webkit-user-select: none;
                user-select: none;
                -webkit-user-drag: none;
            }
        }

        & .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 100%;

            @media screen and (min-width: 1440px) {
                flex-direction: row;
                justify-content: space-evenly;
                align-items: flex-start;
                height: 100%;
            }
        }

        & .leaders-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 80%;
            width: 90%;
            padding: 1em 0;
            margin-bottom: 1em;
            border-radius: 16px;

            @media screen and (min-width: 1440px) {
                height: 90%;
                width: 32%;
            }

            & .title {
                display: flex;
                align-items: center;
                font-size: 1.5em;
                font-weight: 700;
                padding: 10px 20px;
                margin-bottom: 0.5em;

                svg {
                    font-size: 0.8em;
                    margin-right: 0.5em;
                }
            }

            & .leaders {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                overflow-x: hidden;
                overflow-y: scroll;
                height: 100%;
                width: 90%;
                border-radius: 5px;
                background-color: #0000007a;
            }

            & .headers {
                display: flex;
                justify-content: center;
                margin: 1em;
                font-size: 1.2em;
                font-family: Bebas Neue, Roboto Condensed, Arial;
                font-weight: 700;
                width: 100%;
            }

            & .entry-container {
                display: flex;
                align-items: center;
                overflow-x: auto;
                overflow-y: hidden;
                min-height: 10em;
                width: 100%;
                padding-bottom: 0.5em;
                border-bottom: 1px solid rgba(148, 148, 148, 0.3);
                font-size: 0.8em;

                & .entries {
                    display: flex;
                    justify-content: space-between;
                    margin: auto;
                }

                & .entry {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    height: 9em;
                    width: 7em;
                    margin: 0 0.5em;
                    & .name {
                        margin-top: 0.5em;
                        margin-bottom: 0.25em;
                    }
                    & .image {
                        display: flex;
                        justify-content: center;
                        border-radius: 100px;
                        overflow: hidden;
                        height: 4em;
                        width: 4em;
                        background-color: #b8b8b8;
                        & img {
                            height: 4em;
                        }
                    }
                }
            }
        }

        & .leaderboard-container {
            display: flex;
            min-height: 70%;
            height: 70%;
            width: 90%;
            position: relative;
            margin-bottom: 3em;

            @media screen and (min-width: 1440px) {
                height: 90%;
                width: 32%;
            }
        }

        & .footer {
            display: flex;
            align-items: center;
            margin-bottom: 0.5em;
            height: 1em;
            font-size: 1rem;
            color: #5e5e5e;
            font-family: Roboto Condensed, Arial;
            font-weight: 300;

            & svg {
                font-size: 0.7em;
                margin: 0 0.4em;
            }
        }
    `

    return (
        <HomeContainer>
            <div className="logo">
                NBA
                <img src="/nbaversus.png" alt="" />
            </div>
            <div className="content">
                <div className="leaderboard-container">
                    <Leaderboard />
                </div>
                <div className="leaders-container">
                    <div className="title">
                        <FaFire color="orange" /> Daily Leaders
                    </div>
                    <div className="leaders">
                        {loading && <Spinner />}
                        {JSON.stringify(leaders) !== "{}" && (
                            <>
                                <div className="headers">Points</div>
                                <div className="entry-container">
                                    <div className="entries">
                                        {leaders.daily.points.map((item) => (
                                            <Entry entry={item} />
                                        ))}
                                    </div>
                                </div>
                                <div className="headers">Rebounds</div>
                                <div className="entry-container">
                                    <div className="entries">
                                        {leaders.daily.rebounds.map((item) => (
                                            <Entry entry={item} />
                                        ))}
                                    </div>
                                </div>
                                <div className="headers">Assists</div>
                                <div className="entry-container">
                                    <div className="entries">
                                        {leaders.daily.assists.map((item) => (
                                            <Entry entry={item} />
                                        ))}
                                    </div>
                                </div>
                                <div className="headers">Steals</div>
                                <div className="entry-container">
                                    <div className="entries">
                                        {leaders.daily.steals.map((item) => (
                                            <Entry entry={item} />
                                        ))}
                                    </div>
                                </div>
                                <div className="headers">Blocks</div>
                                <div className="entry-container">
                                    <div className="entries">
                                        {leaders.daily.blocks.map((item) => (
                                            <Entry entry={item} />
                                        ))}
                                    </div>
                                </div>
                                <div className="headers">Threes Made</div>
                                <div
                                    className="entry-container"
                                    style={{ border: "none" }}
                                >
                                    <div className="entries">
                                        {leaders.daily.threes.map((item) => (
                                            <Entry entry={item} />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="leaders-container">
                    <div className="title">
                        <FaMedal /> Season Leaders
                    </div>
                    <div className="leaders">
                        {loading && <Spinner />}
                        {JSON.stringify(leaders) !== "{}" && (
                            <>
                                <div className="headers">Points</div>
                                <div className="entry-container">
                                    <div className="entries">
                                        {leaders.season.points.map((item) => (
                                            <Entry entry={item} />
                                        ))}
                                    </div>
                                </div>
                                <div className="headers">Rebounds</div>
                                <div className="entry-container">
                                    <div className="entries">
                                        {leaders.season.rebounds.map((item) => (
                                            <Entry entry={item} />
                                        ))}
                                    </div>
                                </div>
                                <div className="headers">Assists</div>
                                <div className="entry-container">
                                    <div className="entries">
                                        {leaders.season.assists.map((item) => (
                                            <Entry entry={item} />
                                        ))}
                                    </div>
                                </div>
                                <div className="headers">Steals</div>
                                <div className="entry-container">
                                    <div className="entries">
                                        {leaders.season.steals.map((item) => (
                                            <Entry entry={item} />
                                        ))}
                                    </div>
                                </div>
                                <div className="headers">Blocks</div>
                                <div className="entry-container">
                                    <div className="entries">
                                        {leaders.season.blocks.map((item) => (
                                            <Entry entry={item} />
                                        ))}
                                    </div>
                                </div>
                                <div className="headers">Threes Made</div>
                                <div
                                    className="entry-container"
                                    style={{ border: "none" }}
                                >
                                    <div className="entries">
                                        {leaders.season.threes.map((item) => (
                                            <Entry entry={item} />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </HomeContainer>
    )
}

export default Home
