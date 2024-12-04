import "./Stats.css"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

import Spinner from "./Spinner"

import { AiOutlineClose } from "react-icons/ai"
import { IoInformationCircle } from "react-icons/io5"

const Stats = (props) => {
    const [stats1, setStats1] = useState(null)
    const [stats2, setStats2] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchStats = async () => {
            const statsResponse = await axios
                .post("/api/stats/season", {
                    ids: [props.player1.personId, props.player2.personId],
                })
                .catch((error) => {
                    toast.error(error.response.data)
                    setLoading(false)
                })
            setLoading(false)
            setStats1(statsResponse.data[props.player1.personId])
            setStats2(statsResponse.data[props.player2.personId])
        }
        fetchStats()
    }, [props.player1, props.player2])

    function handleClick() {
        props.setMenuOpen(false)
        props.setMenuClosed(true)
        props.setStats(false)
    }

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

    return (
        <section className="stats-container">
            <div className="close" onClick={handleClick}>
                <AiOutlineClose />
            </div>
            <div className="title">
                <IoInformationCircle size={"1.35em"} /> Stats
            </div>
            <div className="headers">
                <Row
                    left={
                        <span className="heading">
                            {props.player1.name
                                .split(" ")
                                .splice(1, 2)
                                .join(" ")}
                        </span>
                    }
                    middle=""
                    right={
                        <span className="heading">
                            {props.player2.name
                                .split(" ")
                                .splice(1, 2)
                                .join(" ")}
                        </span>
                    }
                />
            </div>
            <div className="stats">
                {loading && <Spinner />}
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
                            left={stats1?.REB}
                            leftSub={stats1?.REB_RANK}
                            middle="REB"
                            right={stats2?.REB}
                            rightSub={stats2?.REB_RANK}
                        />
                        <Row
                            left={stats1?.AST}
                            leftSub={stats1?.AST_RANK}
                            middle="AST"
                            right={stats2?.AST}
                            rightSub={stats2?.AST_RANK}
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
                            left={stats1?.FGM}
                            leftSub={stats1?.FGM_RANK}
                            middle="FGM"
                            right={stats2?.FGM}
                            rightSub={stats2?.FGM_RANK}
                        />
                        <Row
                            left={stats1?.FGA}
                            leftSub={stats1?.FGA_RANK}
                            middle="FGA"
                            right={stats2?.FGA}
                            rightSub={stats2?.FGA_RANK}
                        />
                        <Row
                            left={(stats1?.FG_PCT * 100).toFixed(1)}
                            leftSub={stats1?.FG_PCT_RANK}
                            middle="FG%"
                            right={(stats2?.FG_PCT * 100).toFixed(1)}
                            rightSub={stats2?.FG_PCT_RANK}
                        />
                        <Row
                            left={stats1?.FG3M}
                            leftSub={stats1?.FG3M_RANK}
                            middle="3PM"
                            right={stats2?.FG3M}
                            rightSub={stats2?.FG3M_RANK}
                        />
                        <Row
                            left={stats1?.FG3A}
                            leftSub={stats1?.FG3A_RANK}
                            middle="3PA"
                            right={stats2?.FG3A}
                            rightSub={stats2?.FG3A_RANK}
                        />
                        <Row
                            left={(stats1?.FG3_PCT * 100).toFixed(1)}
                            leftSub={stats1?.FG3_PCT_RANK}
                            middle="3P%"
                            right={(stats2?.FG3_PCT * 100).toFixed(1)}
                            rightSub={stats2?.FG3_PCT_RANK}
                        />
                        <Row
                            left={stats1?.FTM}
                            leftSub={stats1?.FTM_RANK}
                            middle="FTM"
                            right={stats2?.FTM}
                            rightSub={stats2?.FTM_RANK}
                        />
                        <Row
                            left={stats1?.FTA}
                            leftSub={stats1?.FTA_RANK}
                            middle="FTA"
                            right={stats2?.FTA}
                            rightSub={stats2?.FTA_RANK}
                        />
                        <Row
                            left={(stats1?.FT_PCT * 100).toFixed(1)}
                            leftSub={stats1?.FT_PCT_RANK}
                            middle="FT%"
                            right={(stats2?.FT_PCT * 100).toFixed(1)}
                            rightSub={stats2?.FT_PCT_RANK}
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
        </section>
    )
}
export default Stats
