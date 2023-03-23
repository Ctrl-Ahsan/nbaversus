import { useState } from "react"
import styled from "styled-components"
import { toast } from "react-toastify"
import { BiSupport } from "react-icons/bi"
import emailjs from "emailjs-com"
import Spinner from "./Spinner"

const Contact = () => {
    const [submit, setSubmit] = useState(false)
    const Form = () => {
        const [formData, setFormData] = useState({
            name: "",
            email: "",
            message: "",
        })
        const { name, email, message } = formData

        const onChange = (e) => {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }

        const onSubmit = (e) => {
            e.preventDefault()
            setSubmit(true)
            emailjs
                .sendForm(
                    "service_o2hkgsn",
                    "template_54z6fnm",
                    e.target,
                    "Ec62-6gaZWpu-S_FN"
                )
                .then(
                    (result) => {
                        setSubmit(false)
                        toast.success("Your message has been sent!")
                        setFormData({ name: "", email: "", message: "" })
                    },
                    (error) => {
                        setSubmit(false)
                        toast.error("Oops, something went wrong")
                    }
                )
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
                        placeholder="Name"
                        onChange={onChange}
                    />
                </div>
                <div className="form-item">
                    <input
                        required
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        placeholder="Email"
                        onChange={onChange}
                    />
                </div>
                <div className="form-item">
                    <textarea
                        required
                        id="message"
                        name="message"
                        value={message}
                        placeholder="Message"
                        onChange={onChange}
                    />
                </div>
                <div className="form-item">
                    {submit ? (
                        <div className="spinner-container">
                            <Spinner size="small" />
                        </div>
                    ) : (
                        <button type="submit" className="submit">
                            Send
                        </button>
                    )}
                </div>
            </form>
        )
    }

    const ContactContainer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #0000007a;
        border: solid 1px #21212179;
        border-radius: 5px;
        padding: 1em 0;

        & .submit {
            background-color: #008cd2;
        }

        & textarea {
            width: 100%;
            height: 6em;
            font-size: 0.7em;
            font-family: inherit;
            padding: 1em;
            border: 0.1px solid #2a2a2a;
            border-radius: 5px;
            background-color: #333333;
            color: white;
            resize: none;
            overflow-y: scroll;
        }

        & .spinner-container {
            height: 30px;
            position: relative;
            margin-top: 10px;
        }
    `

    return (
        <ContactContainer>
            <div className="form-title">
                <BiSupport /> Contact
            </div>
            <Form />
        </ContactContainer>
    )
}

export default Contact
