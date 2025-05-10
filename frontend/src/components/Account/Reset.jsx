import "./Reset.css"
import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../../firebase"
import { toast } from "react-toastify"

const Reset = (props) => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleResetPassword = async (e) => {
        e.preventDefault()

        if (!email) {
            toast.error("Please enter your email address")
            return
        }

        setLoading(true)

        try {
            await sendPasswordResetEmail(auth, email)
            toast.success("Password reset email sent to " + email + ".", {
                autoClose: 30000,
            })
            props.setToggleReset(false)
        } catch (error) {
            console.error(error)
            toast.error("Failed to send reset email. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="reset-container">
            <div className="form-title" style={{ marginBottom: "0.25em" }}>
                Forgot your password?
            </div>

            <form className="form" onSubmit={handleResetPassword}>
                <div className="form-item">
                    <div className="subtitle reset-caption">
                        Enter your email address and we'll send you a link to
                        reset your password.
                    </div>
                </div>
                <div className="form-item">
                    <input
                        required
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <button
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        type="submit"
                        disabled={loading}
                    >
                        <span className="text">
                            {loading ? (
                                <>
                                    Sending
                                    <span
                                        className="spinner"
                                        style={{ marginLeft: "0.5em" }}
                                    />
                                </>
                            ) : (
                                "Send Link"
                            )}
                        </span>
                    </button>
                </div>
                <div className="form-item">
                    <div
                        className="subtitle link"
                        style={{
                            textAlign: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => props.setToggleReset(false)}
                    >
                        Back to Login
                    </div>
                </div>
            </form>
        </section>
    )
}

export default Reset
