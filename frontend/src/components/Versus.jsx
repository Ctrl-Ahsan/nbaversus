import { useState, useEffect, useContext } from "react"
import axios from "axios"
import styled from "styled-components"

import Title from "./Title"
import Play from "./Play"
import Compare from "./Compare"

const Versus = () => {
    const [togglePlay, setTogglePlay] = useState(false)
    const [toggleCompare, setToggleCompare] = useState(false)

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
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
        max-height: -webkit-fill-available;
    `
    return (
        <VersusContainer>
            {togglePlay ? (
                <Play setTogglePlay={setTogglePlay} />
            ) : toggleCompare ? (
                <Compare setToggleCompare={setToggleCompare} />
            ) : (
                <Title
                    setToggleVersus={setTogglePlay}
                    setToggleCompare={setToggleCompare}
                />
            )}
        </VersusContainer>
    )
}

export default Versus
