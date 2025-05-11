import "./Contact.css"
import { useContext, useState } from "react"
import { toast } from "react-toastify"
import { BiSupport } from "react-icons/bi"
import { IoIosMail } from "react-icons/io"
import emailjs from "emailjs-com"
import { AppContext } from "../../AppContext"

const Contact = () => {
    const [loading, setLoading] = useState(false)
    const { user } = useContext(AppContext)
    const Form = () => {
        const [formData, setFormData] = useState({
            name: user?.displayName || "",
            email: user?.email || "",
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
            setLoading(true)
            emailjs
                .sendForm(
                    "service_o2hkgsn",
                    "template_8eaxbsq",
                    e.target,
                    "Ec62-6gaZWpu-S_FN"
                )
                .then(
                    (result) => {
                        setLoading(false)
                        toast.success("Your message has been sent!")
                        setFormData({ name: "", email: "", message: "" })
                    },
                    (error) => {
                        setLoading(false)
                        toast.error("Oops, something went wrong.")
                        console.log(error)
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
                    <button
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        type="submit"
                        className="blue"
                        disabled={loading}
                    >
                        <span className="text">
                            {loading ? (
                                <>
                                    Sending
                                    <span
                                        className="spinner"
                                        style={{ marginLeft: "0.5em" }}
                                    />
                                </>
                            ) : (
                                "Send"
                            )}
                        </span>
                    </button>
                </div>
                <div class="divider">
                    <span>OR</span>
                </div>
                <div className="contact-email">
                    <IoIosMail />
                    <a href="mailto:support@nbaversus.com">
                        support@nbaversus.com
                    </a>
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
