import { useState } from "react"
import styled from "styled-components"
import { toast } from "react-toastify"
import { FaUser } from "react-icons/fa"
import axios from "axios"
import Spinner from "../components/Spinner"

const Register = (props) => {
    const Form = () => {
        const [formData, setFormData] = useState({
            name: "",
            password: "",
            password2: "",
        })

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
                toast.error("Please fill in all register fields")
            } else if (password !== password2) {
                toast.error("Passwords do not match")
            } else {
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
                        }
                    })
                    .catch((error) => {
                        toast.error(error.response.data)
                    })
            }
        }

        return (
            <form className="form" onSubmit={onSubmit}>
                <div className="form-item">
                    <input
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
                        type="password"
                        id="password2"
                        name="password2"
                        value={password2}
                        placeholder="Confirm password"
                        onChange={onChange}
                    />
                </div>
                <div className="form-item">
                    <button className="signup" type="submit">
                        Sign Up
                    </button>
                </div>
            </form>
        )
    }

    const RegisterContainer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
    `

    return (
        <RegisterContainer>
            <div className="form-title">
                <FaUser /> Register
            </div>
            <Form />
        </RegisterContainer>
    )
}

export default Register
