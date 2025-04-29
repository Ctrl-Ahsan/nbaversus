import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"

const Success = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const sessionId = searchParams.get("session_id")

        if (sessionId) {
            toast.success("Your account has been upgraded!  🎉")
        }

        navigate("/account")
    }, [navigate, searchParams])

    return null
}

export default Success
