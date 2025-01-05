import "./Contact.css"
import { useState } from "react"
import { toast } from "react-toastify"
import { BiSupport } from "react-icons/bi"
import emailjs from "emailjs-com"
import Spinner from "../Spinner/Spinner"

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
                    "template_8eaxbsq",
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
            <form className="form" style={{ width: "80%" }} onSubmit={onSubmit}>
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
                        type="email"
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
                        <button type="submit" className="blue">
                            Send
                        </button>
                    )}
                </div>
            </form>
        )
    }

    return (
        <section className="contact-container">
            <div className="form-title">
                <BiSupport /> Contact
            </div>
            <Form />
        </section>
    )
}

export default Contact
