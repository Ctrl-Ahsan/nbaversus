import { createContext, useState, useEffect } from "react"
import { auth } from "./firebase"
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth"
import axios from "axios"

export const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isPremium, setIsPremium] = useState(false)
    const [userLoading, setUserLoading] = useState(true)
    const [linesRemaining, setLinesRemaining] = useState(0)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser)
                const tokenResult = await getIdTokenResult(firebaseUser, true) // force refresh
                setIsPremium(!!tokenResult.claims.premium)

                if (!isPremium) {
                    const token = tokenResult.token
                    const res = await axios.get("/api/lines/usage", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    setLinesRemaining(res.data)
                }
            } else {
                setUser(null)
                setIsPremium(false)
                setLinesRemaining(0)
            }
            setUserLoading(false)
        })

        return () => unsubscribe() // clean up listener
    }, [])

    const [filters, setFilters] = useState({
        minutesMin: 0,
        minutesMax: 60,
        home: true,
        away: true,
        win: true,
        loss: true,
        exludeBlowoutWins: false,
        exludeBlowoutLosses: false,
    })

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
        user,
        setUser,
        isPremium,
        setIsPremium,
        userLoading,
        setUserLoading,
        linesRemaining,
        setLinesRemaining,
        filters,
        setFilters,
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
