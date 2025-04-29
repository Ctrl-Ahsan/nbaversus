import "./Account.css"
import { useState } from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { PiStarFourFill } from "react-icons/pi"

import Register from "./Register"
import Login from "./Login"
import Profile from "./Profile"
import Contact from "./Contact"
import Premium from "./Premium"
import { auth } from "../../firebase"
import Success from "./Success"

const Account = () => {
    const [loggedIn, setLoggedIn] = useState(
        localStorage.getItem("user") !== null
    )
    const [toggleRegister, setToggleRegister] = useState(false)

    const location = useLocation()
    const currentPath = location.pathname

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
                <nav className="nav">
                    <Link
                        to="/account"
                        className={`heading ${
                            currentPath === "/account" ? "active" : ""
                        }`}
                    >
                        <div className="headingText">Account</div>
                    </Link>
                    <Link
                        to="/account/premium"
                        className={`heading ${
                            currentPath === "/account/premium" ? "active" : ""
                        }`}
                    >
                        <div className="headingText">
                            <PiStarFourFill /> Premium
                        </div>
                    </Link>
                    <Link
                        to="/account/support"
                        className={`heading ${
                            currentPath === "/account/support" ? "active" : ""
                        }`}
                    >
                        <div className="headingText">Support</div>
                    </Link>
                </nav>

                <Routes>
                    <Route
                        index
                        element={
                            loggedIn ? (
                                <Profile setLoggedIn={setLoggedIn} />
                            ) : toggleRegister ? (
                                <Register
                                    setLoggedIn={setLoggedIn}
                                    setToggleRegister={setToggleRegister}
                                    handleGoogleSignIn={handleGoogleSignIn}
                                />
                            ) : (
                                <Login
                                    setLoggedIn={setLoggedIn}
                                    setToggleRegister={setToggleRegister}
                                    handleGoogleSignIn={handleGoogleSignIn}
                                />
                            )
                        }
                    />
                    <Route path="premium" element={<Premium />} />
                    <Route path="success" element={<Success />} />
                    <Route path="support" element={<Contact />} />
                </Routes>
            </div>
        </main>
    )
}

export default Account
