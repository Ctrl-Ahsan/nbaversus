import { useState, useEffect } from "react"
import styled from "styled-components"
import { AiOutlineClose } from "react-icons/ai"
import { IoIosStats } from "react-icons/io"

const Stats = (props) => {
    const [stats1, setStats1] = useState(null)
    const [stats2, setStats2] = useState(null)

    useEffect(() => {
        const fetchStats = () => {
            Promise.all([
                fetch(
                    `https://data.nba.net/data/10s/prod/v1/2022/players/${props.p1.personId}_profile.json`
                ).then((value) => value.json()),
                fetch(
                    `https://data.nba.net/data/10s/prod/v1/2022/players/${props.p2.personId}_profile.json`
                ).then((value) => value.json()),
            ]).then(([json1, json2]) => {
                setStats1(json1)
                setStats2(json2)
            })
        }
        fetchStats()
    }, [props.p1, props.p2, props.toggleStats])

    const Row = (props) => {
        return (
            <>
                <div className="text">{props.left}</div>
                <div className="heading text">{props.middle}</div>
                <div className="text">{props.right}</div>
            </>
        )
    }

    function handleClick() {
        props.setMenuOpen(false)
        props.setMenuClosed(true)
        props.setToggleStats(false)
    }

    // styling
    const StatsContainer = styled.section`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;

        background: rgba(0, 0, 0, 0.4);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(148, 148, 148, 0.3);

        color: white;
        font-weight: 300;

        width: 70%;
        max-width: 740px;
        padding: 20px;

        ${props.toggleStats ? "" : "display: none;"}

        & .close {
            position: absolute;
            top: 1em;
            right: 1em;
            cursor: pointer;
        }

        & .title {
            font-size: 1.5em;
            font-weight: 700;
            padding: 10px 20px;
            margin-bottom: 0.5em;

            svg {
                font-size: 0.7em;
                margin-right: 5px;
            }
        }

        & .stats {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-row-gap: 20px;
            background-color: #0000007a;
            border: solid 1px #21212179;
            border-radius: 5px;
            padding: 0.5em 10px;
        }

        & .heading {
            font-family: Roboto Condensed, Roboto, Arial;
            font-weight: 700;
        }

        & .text {
            padding: 0.4em;
        }
    `

    return (
        <StatsContainer>
            <div className="close" onClick={handleClick}>
                <AiOutlineClose />
            </div>
            <div className="title">
                <IoIosStats /> Stats
            </div>
            <div className="stats">
                <Row
                    left={<span className="heading">{props.p1.lastName}</span>}
                    middle=""
                    right={<span className="heading">{props.p2.lastName}</span>}
                />

                <Row
                    left={stats1?.league?.standard?.stats?.careerSummary.ppg}
                    middle="PPG"
                    right={stats2?.league?.standard?.stats?.careerSummary.ppg}
                />
                <Row
                    left={stats1?.league?.standard?.stats?.careerSummary.apg}
                    middle="APG"
                    right={stats2?.league?.standard?.stats?.careerSummary.apg}
                />
                <Row
                    left={stats1?.league?.standard?.stats?.careerSummary.rpg}
                    middle="RPG"
                    right={stats2?.league?.standard?.stats?.careerSummary.rpg}
                />
                <Row
                    left={stats1?.league?.standard?.stats?.careerSummary.fgp}
                    middle="FG%"
                    right={stats2?.league?.standard?.stats?.careerSummary.fgp}
                />
                <Row
                    left={stats1?.league?.standard?.stats?.careerSummary.tpp}
                    middle="3P%"
                    right={stats2?.league?.standard?.stats?.careerSummary.tpp}
                />
            </div>
        </StatsContainer>
    )
}

export default Stats
