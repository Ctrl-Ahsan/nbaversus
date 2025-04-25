import "./Navbar.css"
import { Link, useLocation } from "react-router-dom"

import { GoHome, GoHomeFill } from "react-icons/go"
import { FaMagnifyingGlass, FaMagnifyingGlassChart } from "react-icons/fa6"
import {
    IoStatsChartOutline,
    IoStatsChart,
    IoBasketball,
    IoBasketballOutline,
} from "react-icons/io5"
import { FaUserCircle, FaRegUserCircle } from "react-icons/fa"

const Navbar = () => {
    const location = useLocation()
    const currentPath = location.pathname

    return (
        <nav className="navbar-container">
            <div className="nav">
                <Link className="item" to="/">
                    {currentPath === "/" ? <GoHomeFill /> : <GoHome />}
                    Home
                </Link>
                <Link className="item" to="/versus">
                    {currentPath === "/versus" ? (
                        <IoBasketball />
                    ) : (
                        <IoBasketballOutline />
                    )}
                    Versus
                </Link>
                <Link className="item" to="/compare">
                    {currentPath === "/compare" ? (
                        <FaMagnifyingGlassChart />
                    ) : (
                        <FaMagnifyingGlass />
                    )}
                    Compare
                </Link>
                <Link className="item" to="/parlay">
                    {currentPath === "/parlay" ? (
                        <IoStatsChart />
                    ) : (
                        <IoStatsChartOutline />
                    )}
                    Parlay
                </Link>
                <Link className="item" to="/account">
                    {currentPath === "/account" ? (
                        <FaUserCircle />
                    ) : (
                        <FaRegUserCircle />
                    )}
                    Account
                </Link>
            </div>
        </nav>
    )
}

export default Navbar
