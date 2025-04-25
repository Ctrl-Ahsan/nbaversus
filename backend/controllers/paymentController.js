const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const asyncHandler = require("express-async-handler")

const isProd = process.env.NODE_ENV === "production"
const CLIENT_URL = isProd ? process.env.CLIENT_URL : process.env.CLIENT_URL_DEV

const createCheckoutSession = asyncHandler(async (req, res) => {
    const { uid } = req.body

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: "price_1RHalhCvI0mq4kI8RQby8RMP",
                    quantity: 1,
                },
            ],
            subscription_data: {
                trial_period_days: 7,
                metadata: {
                    firebaseUID: uid,
                },
            },
            metadata: {
                firebaseUID: uid,
            },
            success_url: `${CLIENT_URL}/success`,
            cancel_url: `${CLIENT_URL}/account/premium`,
        })

        res.json({ url: session.url })
    } catch (err) {
        console.error("Stripe error:", err)
        res.status(500).json({ error: "Failed to create checkout session" })
    }
})
module.exports = {
    createCheckoutSession,
}
