import { useContext, useEffect, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { AppContext } from "../../AppContext"

const Success = (props) => {
    const navigate = useNavigate()
    const { user } = useContext(AppContext)
    const [searchParams] = useSearchParams()
    const doneRef = useRef(false)

    useEffect(() => {
        if (!user) return

        const checkPremium = async () => {
            if (doneRef.current) return
            doneRef.current = true

            props.setLoading(true)

            const sessionId = searchParams.get("session_id")
            if (!sessionId) {
                props.setLoading(false)
                navigate("/account")
                return
            }

            try {
                const tokenResult = await user.getIdTokenResult(true)
                const isPremium = tokenResult.claims.premium

                if (isPremium) {
                    toast.success("Your account has been upgraded! 🎉")
                } else {
                    toast.info("Your upgrade is being processed.")
                }
            } catch (error) {
                console.error(error)
                toast.error("Error checking account status.")
            } finally {
                props.setLoading(false)
                navigate("/account")
            }
        }

        checkPremium()
    }, [navigate, searchParams, user])

    return null
}

export default Success
