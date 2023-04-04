import { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import { AiOutlineClose } from "react-icons/ai"
import { IoIosStats } from "react-icons/io"
import axios from "axios"
import Spinner from "./Spinner"
import { AppContext } from "../AppContext"

const Stats = () => {
    const { player1, player2, setMenuOpen, setMenuClosed, setToggleStats } =
        useContext(AppContext)
    const [stats1, setStats1] = useState(null)
    const [stats2, setStats2] = useState(null)
    const suffix = (num) => {
        if (num > 3 && num < 14) return "th"
        const lastChar = num.toString().slice(-1)
        switch (lastChar) {
            case "1":
                return "st"
            case "2":
                return "nd"
            case "3":
                return "rd"
            default:
                return "th"
        }
    }

    useEffect(() => {
        const fetchStats = async () => {
            const statsResponse = await axios.post("/api/stats", {
                ids: [player1.personId, player2.personId],
            })
            setStats1(statsResponse.data[player1.personId])
            setStats2(statsResponse.data[player2.personId])
        }
        fetchStats()
    }, [player1, player2])
    const Row = (props) => {
        return (
            <>
                <div className="cell">
                    <div>{props.left}</div>
                    <div className="subtitle">
                        {props.leftSub ? `(${props.leftSub}` : ""}
                        {props.leftSub ? `${suffix(props.leftSub)})` : ""}
                    </div>
                </div>
                <div className="heading cell">{props.middle}</div>
                <div className="cell">
                    <div>{props.right}</div>
                    <div className="subtitle">
                        {props.leftSub ? `(${props.rightSub}` : ""}
                        {props.leftSub ? `${suffix(props.rightSub)})` : ""}
                    </div>
                </div>
            </>
        )
    }
    function handleClick() {
        setMenuOpen(false)
        setMenuClosed(true)
        setToggleStats(false)
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
        overflow: hidden;
        width: 75%;
        max-width: 740px;
        padding: 20px;
        & .close {
            position: absolute;
            top: 1em;
            right: 1em;
            cursor: pointer;
            transition: all 0.3s;
            :active {
                scale: 0.9;
            }
        }
        & .title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5em;
            font-weight: 700;
            padding: 10px 20px;
            margin-bottom: 0.5em;
            svg {
                font-size: 0.8em;
                margin-right: 0.2em;
            }
        }

        & .subtitle {
            font-size: 0.65em;
            font-weight: 300;
            color: darkgray;
        }
        & .stats {
            display: grid;
            position: relative;
            height: 55vh;
            overflow-x: hidden;
            overflow-y: scroll;
            grid-template-columns: 2fr 1fr 2fr;
            grid-row-gap: 20px;
            background-color: #0000007a;
            border: solid 1px #21212179;
            border-top: none;
            border-radius: 0px 0px 5px 5px;
            padding: 1em 10px;
        }
        & .headers {
            display: grid;
            grid-template-columns: 2fr 1fr 2fr;
            grid-row-gap: 20px;
            background-color: #0000007a;
            border: solid 1px #21212179;
            border-bottom: none;
            border-radius: 5px 5px 0px 0px;
            padding: 0.5em 10px;
        }
        & .heading {
            font-family: Roboto Condensed, Roboto, Arial;
            font-weight: 700;
        }
        & .cell {
            padding: 0.3em;
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
            <div className="headers">
                <Row
                    left={
                        <span className="heading">
                            {player1.name.split(" ").splice(1, 2).join(" ")}
                        </span>
                    }
                    middle=""
                    right={
                        <span className="heading">
                            {player2.name.split(" ").splice(1, 2).join(" ")}
                        </span>
                    }
                />
            </div>
            <div className="stats">
                {!stats1 && <Spinner />}
                {stats1 && (
                    <>
                        <Row
                            left={stats1?.GP}
                            leftSub={stats1?.GP_RANK}
                            middle="GP"
                            right={stats2?.GP}
                            rightSub={stats2?.GP_RANK}
                        />
                        <Row
                            left={stats1?.MIN}
                            leftSub={stats1?.MIN_RANK}
                            middle="MIN"
                            right={stats2?.MIN}
                            rightSub={stats2?.MIN_RANK}
                        />
                        <Row
                            left={stats1?.PTS}
                            leftSub={stats1?.PTS_RANK}
                            middle="PTS"
                            right={stats2?.PTS}
                            rightSub={stats2?.PTS_RANK}
                        />
                        <Row
                            left={stats1?.AST}
                            leftSub={stats1?.AST_RANK}
                            middle="AST"
                            right={stats2?.AST}
                            rightSub={stats2?.AST_RANK}
                        />
                        <Row
                            left={stats1?.REB}
                            leftSub={stats1?.REB_RANK}
                            middle="REB"
                            right={stats2?.REB}
                            rightSub={stats2?.REB_RANK}
                        />
                        <Row
                            left={(stats1?.FG_PCT * 100).toFixed(1)}
                            leftSub={stats1?.FG_PCT_RANK}
                            middle="FG%"
                            right={(stats2?.FG_PCT * 100).toFixed(1)}
                            rightSub={stats2?.FG_PCT_RANK}
                        />
                        <Row
                            left={(stats1?.FG3_PCT * 100).toFixed(1)}
                            leftSub={stats1?.FG3_PCT_RANK}
                            middle="3P%"
                            right={(stats2?.FG3_PCT * 100).toFixed(1)}
                            rightSub={stats2?.FG3_PCT_RANK}
                        />
                        <Row
                            left={(stats1?.FT_PCT * 100).toFixed(1)}
                            leftSub={stats1?.FT_PCT_RANK}
                            middle="FT%"
                            right={(stats2?.FT_PCT * 100).toFixed(1)}
                            rightSub={stats2?.FT_PCT_RANK}
                        />
                        <Row
                            left={stats1?.STL}
                            leftSub={stats1?.STL_RANK}
                            middle="STL"
                            right={stats2?.STL}
                            rightSub={stats2?.STL_RANK}
                        />
                        <Row
                            left={stats1?.BLK}
                            leftSub={stats1?.BLK_RANK}
                            middle="BLK"
                            right={stats2?.BLK}
                            rightSub={stats2?.BLK_RANK}
                        />
                        <Row
                            left={stats1?.TOV}
                            leftSub={stats1?.TOV_RANK}
                            middle="TOV"
                            right={stats2?.TOV}
                            rightSub={stats2?.TOV_RANK}
                        />
                        <Row
                            left={stats1?.PF}
                            leftSub={stats1?.PF_RANK}
                            middle="PF"
                            right={stats2?.PF}
                            rightSub={stats2?.PF_RANK}
                        />
                        <Row
                            left={stats1?.PFD}
                            leftSub={stats1?.PFD_RANK}
                            middle="PFD"
                            right={stats2?.PFD}
                            rightSub={stats2?.PFD_RANK}
                        />
                        <Row
                            left={stats1?.PLUS_MINUS}
                            leftSub={stats1?.PLUS_MINUS_RANK}
                            middle="+/-"
                            right={stats2?.PLUS_MINUS}
                            rightSub={stats2?.PLUS_MINUS_RANK}
                        />
                    </>
                )}
            </div>
        </StatsContainer>
    )
}
export default Stats
