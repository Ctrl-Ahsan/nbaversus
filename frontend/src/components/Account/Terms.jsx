import "./Terms.css"

const Terms = (props) => {
    return (
        <section className="terms-container">
            <div className="form-title" style={{ marginBottom: "0.25em" }}>
                Terms of Service
            </div>

            <div className="terms">
                <p>Last updated: May 10, 2025</p>

                <p>
                    Welcome to NBA Versus! By accessing or using our website
                    (the "Service"), you agree to be bound by these Terms of
                    Service ("Terms"). Please read them carefully.
                </p>

                <h2>1. Use of Our Service</h2>
                <p>
                    You must be at least 13 years old to use NBA Versus. You
                    agree to use the Service only for lawful purposes and in
                    accordance with these Terms.
                </p>

                <h2>2. Account Registration</h2>
                <p>
                    To access certain features of the Service, you must create
                    an account using a valid email address and password or by
                    signing in with Google. You are responsible for maintaining
                    the confidentiality of your account credentials and for all
                    activities that occur under your account.
                </p>

                <h2>3. Premium Services and Subscriptions</h2>
                <p>
                    NBA Versus offers optional premium features through a
                    subscription priced at $5 USD per month, billed via Stripe.
                    New users may receive a one-time 7-day free trial. Each user
                    is entitled to only one trial. Prices are subject to change
                    at any time. Subscriptions are non-refundable, including in
                    cases where you cancel before the end of your billing cycle
                    or free trial period.
                </p>

                <h2>4. Player Statistics and Data Accuracy</h2>
                <p>
                    NBA Versus provides access to player statistics, matchup
                    comparisons, and prop analysis tools based on historical NBA
                    performance data. While we strive to maintain accurate and
                    up-to-date information, we do not guarantee that all
                    statistics or insights are error-free or current at all
                    times. Data may not reflect real-time or live updates. By
                    using the Service, you acknowledge that all data and
                    analysis are provided for informational purposes only and
                    should not be relied upon for betting, gambling, or other
                    financial decisions. We disclaim all liability for
                    inaccuracies, omissions, or any decisions made based on
                    information provided by the Service.
                </p>

                <h2>5. Modifications to the Service</h2>
                <p>
                    We reserve the right to modify, suspend, or discontinue any
                    part of the Service at any time without prior notice.
                </p>

                <h2>6. Termination</h2>
                <p>
                    We may suspend or terminate your access to the Service if
                    you violate these Terms or engage in any behavior that we
                    determine is harmful to the platform or other users.
                </p>

                <h2>7. Intellectual Property</h2>
                <p>
                    All original content on NBA Versus, including but not
                    limited to our logos, website design, graphics, and
                    software, is the property of NBA Versus and is protected by
                    applicable intellectual property laws. Player names, team
                    names, team logos, and other NBA-related marks are the
                    property of the National Basketball Association (NBA) and
                    its respective teams. NBA Versus is an independent platform
                    and is not affiliated with, endorsed by, or sponsored by the
                    NBA or any NBA team. Team logos and related trademarks are
                    used solely for informational and non-commercial purposes.
                    You may not copy, modify, distribute, or reproduce any part
                    of the Service without our prior written consent.
                </p>

                <h2>8. Limitation of Liability</h2>
                <p>
                    To the maximum extent permitted by law, NBA Versus and its
                    operators shall not be liable for any indirect, incidental,
                    special, consequential, or punitive damages arising out of
                    or related to your use of the Service. The Service is
                    provided "as is" without warranties of any kind, either
                    express or implied.
                </p>

                <h2>9. Changes to These Terms</h2>
                <p>
                    We may update these Terms from time to time. Changes will be
                    posted on this page with the updated date. Your continued
                    use of the Service after changes become effective
                    constitutes your acceptance of the new Terms.
                </p>

                <h2>10. Contact Us</h2>
                <p>
                    If you have any questions about these Terms, please contact
                    us at:
                </p>
                <p>📧 support@nbaversus.com</p>
            </div>
            <div
                className="subtitle link"
                onClick={() => props.setToggleTerms(false)}
            >
                Go Back
            </div>
        </section>
    )
}

export default Terms
