import styled from "styled-components"
import { useState, useContext } from "react"
import { AiOutlineClose } from "react-icons/ai"
import Register from "./Register"
import Login from "./Login"
import Profile from "./Profile"
import Contact from "./Contact"
import { AppContext } from "../AppContext"

const User = () => {
    const { setMenuOpen, setMenuClosed, setToggleUser } = useContext(AppContext)
    const [category, setCategory] = useState("account")
    const [loggedIn, setLoggedIn] = useState(false)
    const [toggleRegister, setToggleRegister] = useState(false)

    function handleClick() {
        setMenuOpen(false)
        setMenuClosed(true)
        setToggleUser(false)
    }

    const UserContainer = styled.section`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;

        background: rgba(0, 0, 0, 0.4);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(148, 148, 148, 0.3);

        color: white;
        font-weight: 300;

        display: flex;
        flex-direction: column;
        width: 70%;
        max-width: 740px;
        padding: 20px;

        & #active {
            border-bottom: 1px solid white;
        }

        & button {
            width: 100%;
            margin-top: 5px;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background: #000;
            color: #fff;
            font-size: 1em;
            font-weight: 700;
            cursor: pointer;
            appearance: button;
            align-self: center;

            @media screen and (min-width: 740px) {
                padding: 15px;
            }
        }

        & .red {
            background: #900000;
            :hover {
                background: #780000;
            }
        }
        & .green {
            background: green;
            :hover {
                background: #006c00;
            }
        }
        & .blue {
            background: #008cd2;
            :hover {
                background: #006da3;
            }
        }

        & .close {
            position: absolute;
            top: 1em;
            right: 1em;
            cursor: pointer;
        }

        & .nav {
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            margin-bottom: 1em;
        }

        & .heading {
            font-weight: 700;
            margin-top: 1em;
            padding: 10px 20px;
        }

        & .headingText {
            cursor: pointer;
        }

        & .form {
            width: 70%;
            height: 100%;
        }

        & .form-title {
            font-size: 1.5em;
            font-weight: 700;
            padding: 10px 20px;
            margin-bottom: 0.5em;
            display: flex;
            align-items: center;
            & svg {
                font-size: 1em;
                margin-right: 0.2em;
            }
        }

        & .form-item {
            margin-bottom: 10px;
            width: 100%;
            display: flex;
            justify-content: center;

            & input {
                width: 100%;
                font-size: 0.75em;
                font-family: inherit;
                padding: 10px 15px;
                border: 0.1px solid #2a2a2a;
                border-radius: 5px;
                background-color: #333333;
                color: white;

                @media screen and (min-width: 740px) {
                    padding: 15px;
                }
                @media screen and (min-width: 1080px) {
                    padding: 20px;
                }
            }
        }
        & .divider {
            border: solid 0.5px grey;
            margin: 1em;
        }
    `
    return (
        <UserContainer>
            <div className="close" onClick={handleClick}>
                <AiOutlineClose />
            </div>
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
        </UserContainer>
    )
}

export default User
