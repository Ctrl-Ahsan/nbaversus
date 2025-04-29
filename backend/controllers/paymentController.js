const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel.js")

const isProd = process.env.NODE_ENV === "production"
const CLIENT_URL = isProd ? process.env.CLIENT_URL : process.env.CLIENT_URL_DEV

const createCheckoutSession = asyncHandler(async (req, res) => {
    try {
        // Validate request
        const user = req.user

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        if (user.isPremium) {
            return res
                .status(400)
                .json({ error: "Account has already been upgraded." })
        }

        // Prepare params
        const sessionParams = {
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                { price: "price_1RHalhCvI0mq4kI8RQby8RMP", quantity: 1 },
            ],
            subscription_data: {
                trial_period_days: 7,
                metadata: {
                    firebaseUID: user.uid,
                },
            },
            metadata: {
                firebaseUID: user.uid,
            },
            success_url: `${CLIENT_URL}/account/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}/account/premium`,
        }

        // Attach existing Stripe customer if available
        if (user.stripeCustomerId) {
            sessionParams.customer = user.stripeCustomerId
        }

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create(sessionParams)

        res.json({ url: session.url })
    } catch (err) {
        console.error("Stripe error:", err)
        res.status(500).json({ error: "Failed to create checkout session" })
    }
})

const upgradeUser = asyncHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"]
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object

        const firebaseUID = session.metadata?.firebaseUID

        if (firebaseUID) {
            try {
                const user = await User.findOne({ uid: firebaseUID })

                if (user) {
                    user.isPremium = true
                    if (!user.stripeCustomerId && session.customer) {
                        user.stripeCustomerId = session.customer
                    }
                    await user.save()
                    console.log(
                        `[PREMIUM] User ${firebaseUID} upgraded to Premium!`
                    )
                } else {
                    console.error(
                        "User not found for firebaseUID:",
                        firebaseUID
                    )
                }
            } catch (error) {
                console.error(`Error upgrading User ${firebaseUID}: ${error}`)
            }
        } else {
            console.error("No firebaseUID found in session metadata.")
        }
    }

    res.status(200).send("Webhook received.")
})

module.exports = {
    createCheckoutSession,
    upgradeUser,
}
