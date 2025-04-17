import "./Login.css"
import { useState } from "react"
import { toast } from "react-toastify"
import { FaSignInAlt } from "react-icons/fa"
import axios from "axios"
import Spinner from "../Spinner/Spinner"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase"

const Login = (props) => {
    const Form = () => {
        const [formData, setFormData] = useState({
            email: "",
            password: "",
        })
        const [loading, setLoading] = useState(false)
        const { email, password } = formData

        const onChange = (e) => {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }

        const onSubmit = async (e) => {
            e.preventDefault()

            if (!email || !password) {
                toast.error("Please fill in all fields")
                return
            }
            setLoading(true)
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                )
                const user = userCredential.user

                if (!user.emailVerified) {
                    toast.warn("Please verify your email address to continue.")
                } else {
                    const token = await user.getIdToken()

                    const res = await axios.post(
                        "/api/users/login",
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                    const { name, isPremium } = res.data

                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            name,
                            email: user.email,
                            isPremium,
                            token,
                        })
                    )
                    props.setLoggedIn(true)
                }
            } catch (error) {
                console.error(error)
                const code = error.code

                if (
                    code === "auth/user-not-found" ||
                    code === "auth/invalid-credential"
                ) {
                    toast.error("Invalid login credentials")
                } else if (code === "auth/wrong-password") {
                    toast.error("Incorrect password")
                } else {
                    toast.error("Login failed. Please try again.")
                }
            } finally {
                setLoading(false)
            }
        }

        return (
            <form className="form" onSubmit={onSubmit}>
                <div className="form-item">
                    <input
                        required
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        placeholder="Email"
                        onChange={onChange}
                    />
                </div>
                <div className="form-item">
                    <input
                        required
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        placeholder="Password"
                        onChange={onChange}
                    />
                </div>
                <div className="form-item">
                    {loading ? (
                        <div className="spinner-container">
                            <Spinner size="small" />
                        </div>
                    ) : (
                        <button type="submit">Sign In</button>
                    )}
                </div>
                <hr className="divider" />
                <div className="form-item">
                    <button className="green" onClick={props.setToggleRegister}>
                        Register
                    </button>
                </div>
            </form>
        )
    }

    return (
        <section className="login-container">
            <div className="form-title">
                <FaSignInAlt /> Sign In
            </div>
            <Form />
        </section>
    )
}

export default Login
