import "./NBAVersus.css"
import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import axios from "axios"

import Navbar from "./Navbar/Navbar"
import Home from "./Home/Home"
import Versus from "./Versus/Versus"
import Compare from "./Compare/Compare"
import Parlay from "./Parlay/Parlay"
import Account from "./Account/Account"

const NBAVersus = () => {
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
            <Routes>
                <Route path="/*" element={<Home />} />
                <Route path="/versus" element={<Versus />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/parlay" element={<Parlay />} />
                <Route path="/account/*" element={<Account />} />
            </Routes>
            <Navbar />
        </main>
    )
}

export default NBAVersus
