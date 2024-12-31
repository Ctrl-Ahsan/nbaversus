import "./Navbar.css"

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
    return (
        <nav className="navbar-container">
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
                <div className="item" onClick={() => props.setPage("versus")}>
                    {props.page === "versus" ? (
                        <IoBasketball />
                    ) : (
                        <IoBasketballOutline />
                    )}
                    Versus
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
                        props.setPage("parlay")
                    }}
                >
                    {props.page === "parlay" ? (
                        <IoStatsChart />
                    ) : (
                        <IoStatsChartOutline />
                    )}
                    Parlay
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
        </nav>
    )
}

export default Navbar
