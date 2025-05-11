import "./NBAVersus.css"
import { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import axios from "axios"

import Navbar from "./Navbar/Navbar"
import Home from "./Home/Home"
import Versus from "./Versus/Versus"
import Compare from "./Compare/Compare"
import Parlay from "./Parlay/Parlay"
import Account from "./Account/Account"

const NBAVersus = () => {
    return (
        <main className="nbaversus">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/versus" element={<Versus />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/parlay" element={<Parlay />} />
                <Route path="/account/*" element={<Account />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Navbar />
        </main>
    )
}

export default NBAVersus
