import { useState, useEffect } from "react"
import axios from "axios"
import styled from "styled-components"

import Navbar from "./Navbar"
import Title from "./Title"
import Play from "./Play"
import Compare from "./Compare"
import Analyze from "./Analyze"

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

    // styling
    const VersusContainer = styled.main`
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
        max-height: -webkit-fill-available;
    `
    return (
        <VersusContainer>
            {page === "play" ? (
                <Play />
            ) : page === "compare" ? (
                <Compare />
            ) : page === "analyze" ? (
                <Analyze />
            ) : (
                <Title />
            )}
            <Navbar page={page} setPage={setPage} />
        </VersusContainer>
    )
}

export default Versus
