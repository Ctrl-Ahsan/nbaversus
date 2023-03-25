import styled from "styled-components"
import {
    FaSignInAlt,
    FaBasketballBall,
    FaHeart,
    FaGithub,
} from "react-icons/fa"
import { useEffect } from "react"

const Title = (props) => {
    useEffect(() => {
        if (localStorage.getItem("user")) {
            props.setToggleTitle(false)
        }
    }, [props])

    const TitleContainer = styled.section`
        display: flex;
        flex-direction: column;
        height: 100vh;
        max-height: -webkit-fill-available;
        align-items: center;

        background: linear-gradient(270deg, #860000, #013a6b);
        font-family: Bebas Neue, Roboto, Arial, Helvetica, sans-serif;
        font-size: 8em;
        & .vs {
            display: flex;
            flex-direction: column;
            align-items: center;
            object-fit: contain;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            img {
                margin-top: -30px;
                width: 1.2em;
                -webkit-touch-callout: none;
                -webkit-tap-highlight-color: transparent;
                -moz-user-select: none;
                -webkit-user-select: none;
                user-select: none;
                -webkit-user-drag: none;
            }
        }

        & button {
            width: 95%;
            margin-top: 5px;
            padding: 10px;
            border: none;
            border-radius: 10px;
            background: #000;
            color: #fff;
            font-family: Roboto, Arial;
            font-size: 0.11em;
            font-weight: 700;
            cursor: pointer;
            appearance: button;
            align-self: center;

            @media screen and (min-width: 740px) {
                padding: 15px;
            }

            & svg {
                font-size: 0.8em;
                padding-top: 2px;
            }
        }

        & .footer {
            font-size: 1rem;
            color: #5e5e5e;
            font-family: Roboto Condensed, Arial;
            font-weight: 300;
            position: absolute;
            bottom: 5px;

            & svg {
                font-size: 0.7em;
            }
        }
    `

    return (
        <TitleContainer>
            <div className="vs">
                NBA
                <img src="/nbaversus.png" alt="" />
                <button
                    onClick={() => {
                        props.setToggleTitle(false)
                    }}
                    className="button"
                    style={{ marginTop: "30px", marginBottom: "0.2em" }}
                >
                    <FaSignInAlt /> Sign In
                </button>
                <button
                    onClick={() => {
                        props.setToggleTitle(false)
                    }}
                    className="button"
                    style={{ backgroundColor: "green" }}
                >
                    <FaBasketballBall /> Play as Guest
                </button>
            </div>
            <div className="footer">
                Made with{" "}
                <span>
                    <FaHeart />
                </span>{" "}
                by <FaGithub /> Ctrl-Ahsan
            </div>
        </TitleContainer>
    )
}

export default Title
