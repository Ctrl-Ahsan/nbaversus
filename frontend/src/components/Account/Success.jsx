import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { auth } from "../../firebase"
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth"

const Success = (props) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const sessionId = searchParams.get("session_id")
        if (!sessionId) return navigate("/account")

        let retries = 0
        let done = false

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user || done) return

            const checkPremium = async () => {
                props.setLoading(true)
                const tokenResult = await getIdTokenResult(user, true)
                const isPremium = tokenResult.claims.premium

                if (isPremium) {
                    toast.success("Your account has been upgraded!  🎉")
                    done = true
                    props.setLoading(false)
                    navigate("/account")
                } else if (retries < 5) {
                    retries++
                    setTimeout(checkPremium, 1000)
                } else {
                    toast.info("Your upgrade is being processed.")
                    done = true
                    props.setLoading(false)
                    navigate("/account")
                }
            }

            checkPremium()
        })

        return () => unsubscribe()
    }, [navigate, searchParams])

    return (
        <div
            className="spinner"
            style={{ marginLeft: "auto", marginRight: "auto", fontSize: "5em" }}
        ></div>
    )
}

export default Success
