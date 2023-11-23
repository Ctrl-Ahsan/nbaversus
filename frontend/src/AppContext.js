import { createContext, useState } from "react"

export const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
    const value = {}

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
