import { useContext, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { auth } from "../../firebase"
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth"
import { AppContext } from "../../AppContext"

const Success = (props) => {
    const navigate = useNavigate()
    const { user } = useContext(AppContext)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        props.setLoading(true)
        if (!user) {
            props.setLoading(false)
            return navigate("/account")
        }
        const sessionId = searchParams.get("session_id")
        if (!sessionId) {
            props.setLoading(false)
            return navigate("/account")
        }

        let retries = 0
        let done = false

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (done) return

            const checkPremium = async () => {
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

    return null
}

export default Success
