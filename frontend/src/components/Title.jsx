import styled from "styled-components"

import { FaHeart, FaGithub } from "react-icons/fa"

const Title = (props) => {
    const TitleContainer = styled.section`
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 92%;
        width: 100%;
        max-height: -webkit-fill-available;

        background: linear-gradient(270deg, #860000, #013a6b);
        font-family: Bebas Neue, Roboto, Arial, Helvetica, sans-serif;
        font-size: 8em;

        @media screen and (min-width: 1080px) {
            height: 100%;
        }
        & .vs {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            object-fit: contain;
            height: 100%;

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

        & .footer {
            font-size: 1rem;
            color: #5e5e5e;
            font-family: Roboto Condensed, Arial;
            font-weight: 300;

            & svg {
                font-size: 0.7em;
            }
        }
    `

    return (
        <TitleContainer>
            <div className="vs fade-in">
                NBA
                <img src="/nbaversus.png" alt="" />
            </div>
        </TitleContainer>
    )
}

export default Title
