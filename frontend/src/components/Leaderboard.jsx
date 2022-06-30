import axios from "axios"
import styled from "styled-components"

const Leaderboard = () => {
    axios.get("/api/votes").then((res) => console.log(res))
}

export default Leaderboard
