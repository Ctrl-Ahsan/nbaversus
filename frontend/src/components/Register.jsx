import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"
import { toast } from "react-toastify"
import { FaUser } from "react-icons/fa"
import { register, reset } from "../features/auth/authSlice"
import Spinner from "../components/Spinner"

const Register = (props) => {
    const Form = () => {
        const [formData, setFormData] = useState({
            name: "",
            password: "",
            password2: "",
        })

        const { name, password, password2 } = formData

        const dispatch = useDispatch()

        const { user, isLoading, isError, isSuccess, message } = useSelector(
            (state) => state.auth
        )

        useEffect(() => {
            if (isError) {
                toast.error(message)
            }

            dispatch(reset())
        }, [user, isError, isSuccess, message, dispatch])

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

                dispatch(register(userData))
            }
        }

        if (isLoading) {
            return <Spinner />
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
