import { useState } from "react"
import Builder from "./Builder"
import { PiStarFourFill } from "react-icons/pi"

const Analyzer = () => {
    const [tab, setTab] = useState("builder")

    return (
        <div className="analyzer">
            <nav className="nav">
                <div
                    className={`heading ${tab === "builder" && "active"}`}
                    onClick={() => setTab("builder")}
                >
                    Builder
                </div>
                <div
                    className={`heading ${tab === "filters" && "active"}`}
                    onClick={() => setTab("filters")}
                >
                    <PiStarFourFill /> Filters
                </div>
            </nav>
            {tab === "filters" ? "" : <Builder />}
        </div>
    )
}

export default Analyzer
