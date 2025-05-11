import "./Account.css"
import { useContext, useState } from "react"
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase"
import { PiStarFourFill } from "react-icons/pi"

import Register from "./Register"
import Login from "./Login"
import Profile from "./Profile"
import Contact from "./Contact"
import Premium from "./Premium"
import Success from "./Success"
import { AppContext } from "../../AppContext"
import Reset from "./Reset"
import Terms from "./Terms"
import Privacy from "./Privacy"

const Account = () => {
    const [toggleRegister, setToggleRegister] = useState(false)
    const [toggleReset, setToggleReset] = useState(false)
    const [toggleTerms, setToggleTerms] = useState(false)
    const [togglePrivacy, setTogglePrivacy] = useState(false)
    const [loading, setLoading] = useState(false)
    const { user, isPremium, userLoading } = useContext(AppContext)

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
            window.history.replaceState({}, "", "/account")
        } catch (error) {
            console.error(error)
            toast.error("Google sign-in failed")
        }
    }

    let activeScreen

    if (user) {
        activeScreen = <Profile />
    } else if (toggleTerms) {
        activeScreen = <Terms setToggleTerms={setToggleTerms} />
    } else if (togglePrivacy) {
        activeScreen = <Privacy setTogglePrivacy={setTogglePrivacy} />
    } else if (toggleReset) {
        activeScreen = <Reset setToggleReset={setToggleReset} />
    } else if (toggleRegister) {
        activeScreen = (
            <Register
                setToggleRegister={setToggleRegister}
                setToggleTerms={setToggleTerms}
                setTogglePrivacy={setTogglePrivacy}
                handleGoogleSignIn={handleGoogleSignIn}
            />
        )
    } else {
        activeScreen = (
            <Login
                setToggleRegister={setToggleRegister}
                setToggleReset={setToggleReset}
                setToggleTerms={setToggleTerms}
                setTogglePrivacy={setTogglePrivacy}
                handleGoogleSignIn={handleGoogleSignIn}
            />
        )
    }

    return (
        <main className="account-container">
            {userLoading ? (
                <div className="spinner" style={{ fontSize: "5em" }}></div>
            ) : (
                <div className="account-panel">
                    {!loading && (
                        <nav className="nav">
                            <Link
                                to="/account"
                                className={`heading ${
                                    currentPath === "/account" ? "active" : ""
                                }`}
                            >
                                <div className="headingText">Account</div>
                            </Link>
                            {!isPremium && (
                                <Link
                                    to="/account/premium"
                                    className={`heading ${
                                        currentPath === "/account/premium"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <div className="headingText">
                                        <PiStarFourFill /> Premium
                                    </div>
                                </Link>
                            )}
                            <Link
                                to="/account/support"
                                className={`heading ${
                                    currentPath === "/account/support"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <div className="headingText">Support</div>
                            </Link>
                        </nav>
                    )}
                    <Routes>
                        <Route index element={activeScreen} />
                        <Route
                            path="premium"
                            element={
                                <Premium
                                    setToggleTerms={setToggleTerms}
                                    setTogglePrivacy={setTogglePrivacy}
                                />
                            }
                        />
                        <Route
                            path="success"
                            element={<Success setLoading={setLoading} />}
                        />
                        <Route path="support" element={<Contact />} />
                        <Route
                            path="*"
                            element={<Navigate to="/account" replace />}
                        />
                    </Routes>
                </div>
            )}
        </main>
    )
}

export default Account
