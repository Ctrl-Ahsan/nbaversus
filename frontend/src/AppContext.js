import { createContext, useState } from "react"

export const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
    const [selectedPlayers, setSelectedPlayers] = useState([])
    const [selectedScopes, setSelectedScopes] = useState([])
    const [lines, setLines] = useState([])
    const [parlayScope, setParlayScope] = useState("l5")
    const value = {
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
