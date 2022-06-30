import "./App.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Versus from "./components/Versus"

function App() {
    return (
        <>
            <div className="App">
                <Versus />
            </div>
            <ToastContainer />
        </>
    )
}

export default App
