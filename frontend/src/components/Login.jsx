import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"
import { toast } from "react-toastify"
import { FaSignInAlt } from "react-icons/fa"
import { login, reset } from "../features/auth/authSlice"
import Spinner from "../components/Spinner"

const Login = (props) => {
    const Form = () => {
        const [formData, setFormData] = useState({
            name: "",
            password: "",
        })

        const { name, password } = formData

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

            if (name === "" || password === "") {
                toast.error("Please fill in all fields")
            } else {
                const userData = {
                    name,
                    password,
                }
                dispatch(login(userData))
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
                    <button type="submit">Login</button>
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
