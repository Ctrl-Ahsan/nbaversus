import "./Register.css"
import { useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth"
import { auth } from "../../firebase"
import Spinner from "../Spinner/Spinner"

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
                toast.error("Please fill in all fields")
                return
            }
            if (password !== password2) {
                toast.error("Passwords do not match")
                return
            }
            if (name.length > 16) {
                toast.error("Name exceeds 16 character limit")
                return
            }
            if (password.length < 6) {
                toast.error("Password should be at least 6 characters")
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

                await sendEmailVerification(user)
                toast.info("Verification email sent to " + user.email)

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
                props.setToggleRegister()
            } catch (error) {
                console.error(error)
                const code = error.code
                if (code === "auth/email-already-in-use") {
                    toast.error("This email is already in use")
                } else if (code === "auth/invalid-email") {
                    toast.error("Please enter a valid email address")
                } else if (code === "auth/weak-password") {
                    toast.error("Password should be at least 6 characters")
                } else {
                    toast.error("Account creation failed. Please try again")
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
                    {loading ? (
                        <div className="spinner-container">
                            <Spinner size="small" />
                        </div>
                    ) : (
                        <button className="green" type="submit">
                            Sign Up
                        </button>
                    )}
                </div>
                <hr className="divider" />
                <div className="form-item">
                    <button
                        onClick={() => {
                            props.setToggleRegister()
                        }}
                    >
                        Sign In
                    </button>
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
