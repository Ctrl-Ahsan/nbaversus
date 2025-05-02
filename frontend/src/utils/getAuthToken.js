import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { toast } from "react-toastify"

export const getAuthToken = async (user, navigate) => {
    if (!user) {
        toast.warn("Please sign in to continue.")
        navigate("/account")
    }

    try {
        return await user.getIdToken()
    } catch (err) {
        console.error("Token fetch failed:", err)
        toast.error("Session expired. Please sign in again.")
        await signOut(auth)
        navigate("/account")
    }
}
