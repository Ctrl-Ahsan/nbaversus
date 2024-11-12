import styled from "styled-components"

import { GoHome, GoHomeFill } from "react-icons/go"
import { FaMagnifyingGlass, FaMagnifyingGlassChart } from "react-icons/fa6"
import {
    IoStatsChartOutline,
    IoStatsChart,
    IoBasketball,
    IoBasketballOutline,
} from "react-icons/io5"
import { FaRegUserCircle } from "react-icons/fa"

const Navbar = (props) => {
    // styling
    const NavbarContainer = styled.nav`
        z-index: 2;

        height: 8%;
        width: 100%;
        background: linear-gradient(270deg, #860000, #013a6b);
        font-family: Roboto, Arial, Helvetica, sans-serif;
        font-size: 0.6em;

        @media screen and (min-width: 1080px) {
            height: 100%;
            width: 12%;
            background: linear-gradient(0deg, #860000, #013a6b);
            font-size: 0.8em;
        }

        & .nav {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            height: 100%;
            width: 100%;
            background-color: #00000059;

            @media screen and (min-width: 1080px) {
                flex-direction: column;
            }
        }

        & .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            & svg {
                font-size: 2em;
                margin-bottom: 0.1em;
            }
        }
    `
    return (
        <NavbarContainer>
            <div className="nav">
                <div
                    className="item"
                    onClick={() => {
                        props.setPage("home")
                    }}
                >
                    {props.page === "home" ? <GoHomeFill /> : <GoHome />}
                    Home
                </div>
                <div className="item" onClick={() => props.setPage("play")}>
                    {props.page === "play" ? (
                        <IoBasketball />
                    ) : (
                        <IoBasketballOutline />
                    )}
                    Play
                </div>
                <div
                    className="item"
                    onClick={() => {
                        props.setPage("compare")
                    }}
                >
                    {props.page === "compare" ? (
                        <FaMagnifyingGlassChart />
                    ) : (
                        <FaMagnifyingGlass />
                    )}
                    Compare
                </div>
                <div
                    className="item"
                    onClick={() => {
                        props.setPage("analyze")
                    }}
                >
                    {props.page === "analyze" ? (
                        <IoStatsChart />
                    ) : (
                        <IoStatsChartOutline />
                    )}
                    Props
                </div>
                <div
                    className="item"
                    onClick={() => {
                        props.setPage("account")
                    }}
                >
                    <FaRegUserCircle />
                    Account
                </div>
            </div>
        </NavbarContainer>
    )
}

export default Navbar
