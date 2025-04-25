import "./Account.css"
import { useState } from "react"
import Register from "./Register"
import Login from "./Login"
import Profile from "./Profile"
import Contact from "./Contact"
import axios from "axios"
import { toast } from "react-toastify"
import { auth } from "../../firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import Premium from "./Premium"

const Account = () => {
    const [category, setCategory] = useState("account")
    const [loggedIn, setLoggedIn] = useState(
        localStorage.getItem("user") !== null
    )
    const [toggleRegister, setToggleRegister] = useState(false)

    const provider = new GoogleAuthProvider()

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user
            const token = await user.getIdToken()

            let res

            try {
                // Try registering
                res = await axios.post(
                    "/api/users",
                    { name: user.displayName },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
            } catch (error) {
                if (error.response?.status === 409) {
                    // User already exists → fallback to login
                    res = await axios.post(
                        "/api/users/login",
                        {},
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    )
                } else {
                    console.error(error)
                    toast.error("Google sign-in failed")
                }
            }

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
            setLoggedIn(true)
        } catch (error) {
            console.error(error)
            toast.error("Google sign-in failed")
        }
    }

    return (
        <main className="account-container">
            <div className="account-panel">
                <div className="nav">
                    <div
                        id={category === "account" ? "active" : ""}
                        className="heading"
                        onClick={() => {
                            setCategory("account")
                        }}
                    >
                        <div className="headingText">Account</div>
                    </div>
                    <div
                        id={category === "premium" ? "active" : ""}
                        className="heading"
                        onClick={() => {
                            setCategory("premium")
                            setToggleRegister(false)
                        }}
                    >
                        <div className="headingText">Premium</div>
                    </div>
                    <div
                        id={category === "support" ? "active" : ""}
                        className="heading"
                        onClick={() => {
                            setCategory("support")
                            setToggleRegister(false)
                        }}
                    >
                        <div className="headingText">Support</div>
                    </div>
                </div>
                {category === "account" && loggedIn && (
                    <Profile setLoggedIn={setLoggedIn} />
                )}
                {category === "account" && !loggedIn && !toggleRegister && (
                    <Login
                        setLoggedIn={setLoggedIn}
                        setToggleRegister={setToggleRegister}
                        handleGoogleSignIn={handleGoogleSignIn}
                    />
                )}
                {category === "account" && !loggedIn && toggleRegister && (
                    <Register
                        setLoggedIn={setLoggedIn}
                        setToggleRegister={setToggleRegister}
                        handleGoogleSignIn={handleGoogleSignIn}
                    />
                )}
                {category === "premium" && (
                    <Premium setCategory={setCategory} />
                )}
                {category === "support" && <Contact />}
            </div>
        </main>
    )
}

export default Account
