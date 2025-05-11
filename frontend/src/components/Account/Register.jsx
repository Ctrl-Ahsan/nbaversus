import "./Register.css"
import { useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    signOut,
} from "firebase/auth"
import { auth } from "../../firebase"

const Register = (props) => {
    const Form = () => {
        const [formData, setFormData] = useState({
            name: "",
            email: "",
            password: "",
            password2: "",
        })
        const [loading, setLoading] = useState(false)

        const { name, email, password, password2 } = formData

        const onChange = (e) => {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }

        const onSubmit = async (e) => {
            e.preventDefault()

            if (!name || !email || !password || !password2) {
                toast.error("Please fill in all fields.")
                return
            }
            if (password !== password2) {
                toast.error("Passwords do not match.")
                return
            }
            if (name.length > 16) {
                toast.error("Name exceeds 16 character limit.")
                return
            }
            if (password.length < 6) {
                toast.error("Password should be at least 6 characters.")
                return
            }

            setLoading(true)
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                )
                const user = userCredential.user

                await updateProfile(user, {
                    displayName: name,
                })

                await sendEmailVerification(user)
                toast.info("Verification email sent to " + user.email + ".", {
                    autoClose: 30000,
                })

                const token = await user.getIdToken()
                await axios.post(
                    "/api/users",
                    { name },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                await signOut(auth)
                window.history.replaceState({}, "", "/account")
                props.setToggleRegister()
            } catch (error) {
                console.error(error)
                const code = error.code
                if (code === "auth/email-already-in-use") {
                    toast.error("This email is already in use.")
                } else if (code === "auth/invalid-email") {
                    toast.error("Please enter a valid email address.")
                } else if (code === "auth/weak-password") {
                    toast.error("Password should be at least 6 characters.")
                } else {
                    toast.error("Account creation failed. Please try again.")
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
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        placeholder="Username"
                        onChange={onChange}
                    />
                </div>
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
                    <input
                        required
                        type="password"
                        id="password2"
                        name="password2"
                        value={password2}
                        placeholder="Confirm Password"
                        onChange={onChange}
                    />
                </div>
                <div className="form-item">
                    <button className="green" type="submit">
                        <span className="text">
                            {loading ? (
                                <>
                                    Signing Up
                                    <span
                                        className="spinner"
                                        style={{ marginLeft: "0.5em" }}
                                    />
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </span>
                    </button>
                </div>
                <div className="form-item">
                    <div className="subtitle">
                        Already have an account?{" "}
                        <span
                            className="link"
                            onClick={() => {
                                props.setToggleRegister(false)
                            }}
                        >
                            Sign in
                        </span>
                    </div>
                </div>
                <div class="divider">
                    <span>OR</span>
                </div>
                <div className="form-item">
                    <button class="google" onClick={props.handleGoogleSignIn}>
                        <span class="icon-wrapper">
                            <img src="/google.png" class="icon" alt="Google" />
                        </span>
                        <span>Continue with Google</span>
                    </button>
                </div>
                <div className="form-item">
                    <div className="terms-text">
                        By signing up, you agree to our{" "}
                        <span
                            className="link"
                            onClick={() => props.setToggleTerms(true)}
                        >
                            Terms
                        </span>{" "}
                        and{" "}
                        <span
                            className="link"
                            onClick={() => props.setTogglePrivacy(true)}
                        >
                            Privacy Policy
                        </span>
                        .
                    </div>
                </div>
            </form>
        )
    }

    return (
        <section className="register-container">
            <div className="form-title">Create an account</div>
            <Form />
        </section>
    )
}

export default Register
