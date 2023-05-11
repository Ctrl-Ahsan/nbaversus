import { useState } from "react"
import styled from "styled-components"
import { toast } from "react-toastify"
import { IoPersonAdd } from "react-icons/io5"
import axios from "axios"
import Spinner from "../components/Spinner"

const Register = (props) => {
    const Form = () => {
        const [formData, setFormData] = useState({
            name: "",
            password: "",
            password2: "",
        })
        const [loading, setLoading] = useState(false)

        const { name, password, password2 } = formData

        const onChange = (e) => {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }

        const onSubmit = (e) => {
            e.preventDefault()
            if (name === "" || password === "" || password2 === "") {
                toast.error("Please fill in all fields")
            } else if (name.length > 16)
                toast.error("Username exceeds 16 character limit")
            else if (password !== password2)
                toast.error("Passwords do not match")
            else {
                setLoading(true)
                const userData = {
                    name,
                    password,
                }
                axios
                    .post("/api/users", userData)
                    .then((response) => {
                        if (response.data) {
                            localStorage.setItem(
                                "user",
                                JSON.stringify(response.data)
                            )
                            props.setLoggedIn(true)
                            props.setToggleRegister(false)
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
                        Login
                    </button>
                </div>
            </form>
        )
    }

    const RegisterContainer = styled.div`
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
        <RegisterContainer>
            <div className="form-title">
                <IoPersonAdd /> Register
            </div>
            <Form />
        </RegisterContainer>
    )
}

export default Register
