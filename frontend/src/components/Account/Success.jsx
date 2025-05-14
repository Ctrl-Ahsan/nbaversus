import "./Reset.css"
import { useContext, useEffect, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Lottie from "lottie-react"
import { AppContext } from "../../AppContext"
import coinsSpin from "../../assets/coins-spin.json"

const Success = () => {
    const { user, isPremium } = useContext(AppContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user || !isPremium) return navigate("/account", { replace: true })
    }, [user, isPremium, navigate])

    return (
        <section className="success-container">
            <Lottie
                animationData={coinsSpin}
                loop={true}
                style={{ height: "12em", width: "12em" }}
            />

            <div className="form-title" style={{ marginBottom: "0.25em" }}>
                You're Premium!
            </div>

            <form
                className="form"
                onSubmit={(e) => {
                    e.preventDefault()
                    navigate("/account")
                }}
            >
                <div className="form-item">
                    <div className="subtitle success-caption">
                        Your upgrade is complete. You now have full access to
                        premium features.
                    </div>
                </div>
                <div className="form-item">
                    <button type="submit">Done</button>
                </div>
            </form>
        </section>
    )
}

export default Success
