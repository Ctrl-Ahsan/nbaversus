import { createContext, useState } from "react"

export const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
    const [player1, setPlayer1] = useState({})
    const [player2, setPlayer2] = useState({})
    const [p1Wins, setP1Wins] = useState(false)
    const [p2Wins, setP2Wins] = useState(false)
    const [seenPlayers, setSeenPlayers] = useState([])
    const [round, setRound] = useState(1)
    const [menuOpen, setMenuOpen] = useState(false)
    const [menuClosed, setMenuClosed] = useState(false)
    const [toggleStats, setToggleStats] = useState(false)
    const [toggleLeaderboard, setToggleLeaderboard] = useState(false)
    const [toggleUser, setToggleUser] = useState(false)

    const value = {
        player1,
        setPlayer1,
        player2,
        setPlayer2,
        p1Wins,
        setP1Wins,
        p2Wins,
        setP2Wins,
        seenPlayers,
        setSeenPlayers,
        round,
        setRound,
        menuOpen,
        setMenuOpen,
        menuClosed,
        setMenuClosed,
        toggleStats,
        setToggleStats,
        toggleLeaderboard,
        setToggleLeaderboard,
        toggleUser,
        setToggleUser,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
