import "./App.css"
import { ToastContainer, Flip } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import NBAVersus from "./components/NBAVersus"

function App() {
    return (
        <>
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
        </>
    )
}

export default App
