import "./NBAVersus.css"
import { useState, useEffect } from "react"
import axios from "axios"

import Navbar from "./Navbar"
import Home from "./Home"
import Versus from "./Versus"
import Compare from "./Compare"
import Analyze from "./Analyze"
import Account from "./Account/Account"

const NBAVersus = () => {
    const [page, setPage] = useState("home")

    useEffect(() => {
        // log visit
        if (localStorage.getItem("user") !== null) {
            const token = JSON.parse(localStorage.getItem("user")).Token
            axios.post("/api/users/visit", undefined, {
                headers: { Authorization: "Bearer " + token },
            })
        } else {
            axios.post("/api/users/visit")
        }
    }, [])

    return (
        <main className="nbaversus">
            {page === "versus" ? (
                <Versus />
            ) : page === "compare" ? (
                <Compare />
            ) : page === "analyze" ? (
                <Analyze />
            ) : page === "account" ? (
                <Account />
            ) : (
                <Home />
            )}
            <Navbar page={page} setPage={setPage} />
        </main>
    )
}

export default NBAVersus
