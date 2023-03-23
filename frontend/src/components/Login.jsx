import { useState, useEffect } from "react"
import styled from "styled-components"
import { toast } from "react-toastify"
import { FaSignInAlt } from "react-icons/fa"
import axios from "axios"
import Spinner from "../components/Spinner"

const Login = (props) => {
    const Form = () => {
        const [formData, setFormData] = useState({
            name: "",
            password: "",
        })
        const [loading, setLoading] = useState(false)

        const { name, password } = formData

        const onChange = (e) => {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }

        const onSubmit = (e) => {
            e.preventDefault()

            if (name === "" || password === "") {
                toast.error("Please fill in all fields")
            } else {
                setLoading(true)
                const userData = {
                    name,
                    password,
                }
                axios
                    .post("/api/users/login", userData)
                    .then((response) => {
                        if (response.data) {
                            localStorage.setItem(
                                "user",
                                JSON.stringify(response.data)
                            )
                            props.setLoggedIn(true)
                        }
                        setLoading(false)
                    })
                    .catch((error) => {
                        toast.error(error.response.data)
                        setLoading(false)
                    })
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
                        <button type="submit">Login</button>
                    )}
                </div>
                <hr className="divider" />
                <div className="form-item">
                    <button
                        className="signup"
                        onClick={props.setToggleRegister}
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        )
    }

    const LoginContainer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #0000007a;
        border: solid 1px #21212179;
        border-radius: 5px;
        padding: 1em 0;

        & .spinner-container {
            height: 30px;
            position: relative;
            margin-top: 10px;
        }
    `

    return (
        <LoginContainer>
            <div className="form-title">
                <FaSignInAlt /> Login
            </div>
            <Form />
        </LoginContainer>
    )
}

export default Login
