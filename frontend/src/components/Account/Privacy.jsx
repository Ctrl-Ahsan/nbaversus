import "./Terms.css"

const Privacy = (props) => {
    return (
        <section className="terms-container">
            <div className="form-title" style={{ marginBottom: "0.25em" }}>
                Privacy Policy
            </div>

            <div className="terms">
                <p>Last updated: May 10, 2025</p>

                <p>
                    NBA Versus ("we", "our", "us") is committed to protecting
                    your privacy. This Privacy Policy explains how we collect,
                    use, and safeguard your personal information when you use
                    our service.
                </p>

                <h2>1. Information We Collect</h2>
                <p>- Email address</p>
                <p>- Name (if provided through Google Sign-In)</p>
                <p>- Billing information processed securely via Stripe</p>

                <h2>2. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul>
                    <li>Create and manage your account</li>
                    <li>Provide access to app features</li>
                    <li>Communicate with you</li>
                    <li>Manage Premium subscriptions through Stripe</li>
                </ul>

                <h2>3. Third-Party Services</h2>
                <p>
                    We use Firebase Authentication for login, Stripe for payment
                    processing, and EmailJS for support communications. We do
                    not sell or share your personal information with third
                    parties for marketing purposes.
                </p>

                <h2>4. Data Security</h2>
                <p>
                    We implement reasonable security measures and work with
                    trusted third-party providers. However, no method of
                    transmission over the internet is 100% secure.
                </p>

                <h2>5. Cookies</h2>
                <p>We currently do not use cookies for tracking purposes.</p>

                <h2>6. Your Rights</h2>
                <p>
                    You may request access to or deletion of your personal data
                    by contacting us at support@nbaversus.com.
                </p>

                <h2>7. Changes to this Privacy Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. Updates
                    will be posted on this page with a new effective date.
                </p>

                <h2>8. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please
                    contact us at:
                </p>
                <p>📧 support@nbaversus.com</p>
            </div>
            <div
                className="subtitle link"
                onClick={() => props.setTogglePrivacy(false)}
            >
                Go Back
            </div>
        </section>
    )
}

export default Privacy
