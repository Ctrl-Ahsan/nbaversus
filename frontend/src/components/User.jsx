import "./User.css"
import { useState } from "react"
import Register from "./Register"
import Login from "./Login"
import Profile from "./Profile"
import Contact from "./Contact"

const User = () => {
    const [category, setCategory] = useState("account")
    const [loggedIn, setLoggedIn] = useState(
        localStorage.getItem("user") !== null
    )
    const [toggleRegister, setToggleRegister] = useState(false)

    return (
        <div className="user-container">
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
                />
            )}
            {category === "account" && !loggedIn && toggleRegister && (
                <Register
                    setLoggedIn={setLoggedIn}
                    setToggleRegister={setToggleRegister}
                />
            )}
            {category === "support" && <Contact />}
        </div>
    )
}

export default User
