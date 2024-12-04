import "./Versus.css"
import { useState, useEffect } from "react"
import axios from "axios"

import Navbar from "./Navbar"
import Home from "./Home"
import Play from "./Play"
import Compare from "./Compare"
import Analyze from "./Analyze"
import Account from "./Account"

const Versus = () => {
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
        <main className="versus-container">
            {page === "play" ? (
                <Play />
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

export default Versus
