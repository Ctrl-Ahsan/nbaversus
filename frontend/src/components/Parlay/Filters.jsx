import { useContext } from "react"
import { AppContext } from "../../AppContext"
import { FaFilter } from "react-icons/fa"
import { IoIosRefresh } from "react-icons/io"

const Filters = () => {
    const { isPremium } = useContext(AppContext)

    return (
        <>
            <div className="filters">
                <div className="item">
                    <label className="field-label">Minutes Played</label>
                    <div className="range">
                        <input
                            id="minutes-min"
                            type="number"
                            min="0"
                            max="60"
                        />
                        <span>to</span>
                        <input
                            id="minutes-max"
                            type="number"
                            min="0"
                            max="60"
                        />
                    </div>
                </div>
                <div className="item">
                    <label className="field-label">Location</label>
                    <div className="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="location"
                                value="home"
                            />
                            Home
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="location"
                                value="away"
                            />
                            Away
                        </label>
                    </div>
                </div>
                <div className="item">
                    <label className="field-label">Outcome</label>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" name="outcome" value="win" />
                            Win
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="outcome"
                                value="loss"
                            />
                            Loss
                        </label>
                    </div>
                </div>
                <div className="item">
                    <label className="field-label">
                        Exclude Blowouts (20+ Pts)
                    </label>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" id="exclude-blowouts-win" />
                            Wins
                        </label>
                        <label>
                            <input type="checkbox" id="exclude-blowouts-loss" />
                            Losses
                        </label>
                    </div>
                </div>
            </div>

            {/* Submit Buttons */}
            <div className="submit">
                {isPremium ? (
                    <>
                        <button className="clear-btn">
                            <div className="button-content">
                                <div className="content">
                                    <IoIosRefresh />
                                </div>
                                <div>Clear</div>
                            </div>
                        </button>
                        <button className="green">
                            <div className="button-content">
                                <div className="content">
                                    <FaFilter />
                                </div>
                                <div>Filter</div>
                            </div>
                        </button>
                    </>
                ) : (
                    <button style={{ backgroundColor: "gold" }}>
                        <div className="button-content">
                            <div className="content"></div>
                            <div>Get Premium</div>
                        </div>
                    </button>
                )}
            </div>
        </>
    )
}

export default Filters
