import { createContext, useState } from "react"

export const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
    const [player1, setPlayer1] = useState({})
    const [player2, setPlayer2] = useState({})
    const [p1Wins, setP1Wins] = useState(false)
    const [p2Wins, setP2Wins] = useState(false)
    const [sameP1, setSameP1] = useState(false)
    const [sameP2, setSameP2] = useState(false)
    const [seenPlayers, setSeenPlayers] = useState([])
    const [round, setRound] = useState(1)
    const [menuOpen, setMenuOpen] = useState(false)
    const [menuClosed, setMenuClosed] = useState(false)
    const [stats, setStats] = useState(false)
    const [leaderboard, setLeaderboard] = useState(false)
    const [selectedPlayers, setSelectedPlayers] = useState([])
    const [selectedScopes, setSelectedScopes] = useState([])
    const [lines, setLines] = useState([])
    const [parlayScope, setParlayScope] = useState("l5")
    const value = {
        player1,
        setPlayer1,
        player2,
        setPlayer2,
        p1Wins,
        setP1Wins,
        p2Wins,
        setP2Wins,
        sameP1,
        setSameP1,
        sameP2,
        setSameP2,
        seenPlayers,
        setSeenPlayers,
        round,
        setRound,
        menuOpen,
        setMenuOpen,
        menuClosed,
        setMenuClosed,
        stats,
        setStats,
        leaderboard,
        setLeaderboard,
        selectedPlayers,
        setSelectedPlayers,
        selectedScopes,
        setSelectedScopes,
        lines,
        setLines,
        parlayScope,
        setParlayScope,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
