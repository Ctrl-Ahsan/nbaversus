import { useContext } from "react"
import { AppContext } from "../../AppContext"
import { FaFilter } from "react-icons/fa"
import { IoIosRefresh } from "react-icons/io"

const Filters = () => {
    const { isPremium, filters, setFilters } = useContext(AppContext)

    const onChange = (e) => {
        const { name, type, checked, value } = e.target

        setFilters((prevState) => ({
            ...prevState,
            [name]:
                type === "checkbox"
                    ? checked
                    : value === ""
                    ? null
                    : parseInt(value),
        }))
    }

    return (
        <>
            <div className="filters">
                <div className="item">
                    <label className="field-label">Minutes Played</label>
                    <div className="range">
                        <input
                            name="minutesMin"
                            value={filters.minutesMin}
                            type="number"
                            min="0"
                            max={filters.minutesMax}
                            onChange={onChange}
                        />
                        <span>to</span>
                        <input
                            name="minutesMax"
                            value={filters.minutesMax}
                            type="number"
                            min={filters.minutesMin}
                            max="60"
                            onChange={onChange}
                        />
                    </div>
                </div>
                <div className="item">
                    <label className="field-label">Location</label>
                    <div className="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="home"
                                checked={filters.home}
                                onChange={onChange}
                            />
                            Home
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="away"
                                checked={filters.away}
                                onChange={onChange}
                            />
                            Away
                        </label>
                    </div>
                </div>
                <div className="item">
                    <label className="field-label">Outcome</label>
                    <div className="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="win"
                                checked={filters.win}
                                onChange={onChange}
                            />
                            Win
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="loss"
                                checked={filters.loss}
                                onChange={onChange}
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
                            <input
                                type="checkbox"
                                name="excludeBlowoutWins"
                                checked={filters.excludeBlowoutWins}
                                onChange={onChange}
                            />
                            Wins
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="excludeBlowoutLosses"
                                checked={filters.excludeBlowoutLosses}
                                onChange={onChange}
                            />
                            Losses
                        </label>
                    </div>
                </div>
            </div>
            <div className="submit">
                {isPremium ? (
                    <>
                        <button
                            className="clear-btn"
                            onClick={() =>
                                setFilters({
                                    minutesMin: 0,
                                    minutesMax: 60,
                                    home: true,
                                    away: true,
                                    win: true,
                                    loss: true,
                                    exludeBlowoutWins: false,
                                    exludeBlowoutLosses: false,
                                })
                            }
                        >
                            <div className="button-content">
                                <div className="content">
                                    <IoIosRefresh />
                                </div>
                                <div>Reset</div>
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
