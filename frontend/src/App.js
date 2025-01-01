import "./App.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import NBAVersus from "./components/NBAVersus"

function App() {
    return (
        <>
            <div className="App">
                <NBAVersus />
            </div>
            <ToastContainer theme="colored" />
        </>
    )
}

export default App
