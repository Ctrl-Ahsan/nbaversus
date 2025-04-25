import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer, Flip } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import NBAVersus from "./components/NBAVersus"

function App() {
    return (
        <Router>
            <div className="App">
                <NBAVersus />
            </div>
            <ToastContainer
                toastClassName="my-toast"
                position="top-center"
                autoClose={2500}
                hideProgressBar
                theme="dark"
                transition={Flip}
            />
        </Router>
    )
}

export default App
