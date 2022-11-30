import styled from "styled-components"
import { AiOutlineClose } from "react-icons/ai"
import { IoIosStats } from "react-icons/io"

const Stats = (props) => {
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
    console.log(props)
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
                    left={(props.p1.stats?.ppg).toFixed(1)}
                    middle="PPG"
                    right={(props.p2.stats?.ppg).toFixed(1)}
                />
                <Row
                    left={(props.p1.stats?.apg).toFixed(1)}
                    middle="APG"
                    right={(props.p2.stats?.apg).toFixed(1)}
                />
                <Row
                    left={(props.p1.stats?.rpg).toFixed(1)}
                    middle="RPG"
                    right={(props.p2.stats?.rpg).toFixed(1)}
                />
                <Row
                    left={(props.p1.stats?.fgp * 100).toFixed(1)}
                    middle="FG%"
                    right={(props.p2.stats?.fgp * 100).toFixed(1)}
                />
                <Row
                    left={(props.p1.stats?.tpp * 100).toFixed(1)}
                    middle="3P%"
                    right={(props.p2.stats?.tpp * 100).toFixed(1)}
                />
            </div>
        </StatsContainer>
    )
}

export default Stats
