const firebaseAdmin = require("../firebaseAdmin")
const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel.js")

const isProd = process.env.NODE_ENV === "production"
const CLIENT_URL = isProd ? process.env.CLIENT_URL : process.env.CLIENT_URL_DEV

const createCheckoutSession = asyncHandler(async (req, res) => {
    try {
        const user = req.user

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        if (user.isPremium) {
            return res
                .status(400)
                .json({ error: "Account has already been upgraded." })
        }

        // Create Stripe customer if needed
        if (!user.stripeCustomerId) {
            const customer = await stripe.customers.create({
                metadata: {
                    firebaseUID: user.uid,
                },
            })

            user.stripeCustomerId = customer.id
            await user.save()
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            customer: user.stripeCustomerId,
            line_items: [
                {
                    price: "price_1RHalhCvI0mq4kI8RQby8RMP", // your price ID
                    quantity: 1,
                },
            ],
            subscription_data: {
                trial_period_days: 7,
            },
            metadata: {
                firebaseUID: user.uid,
            },
            success_url: `${CLIENT_URL}/account/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}/account/premium`,
        })

        res.json({ url: session.url })
    } catch (err) {
        console.error("Stripe error:", err)
        res.status(500).json({ error: "Failed to create checkout session" })
    }
})

const createManageSession = asyncHandler(async (req, res) => {
    try {
        const user = req.user

        if (!user || !user.stripeCustomerId) {
            return res
                .status(400)
                .json({ error: "Stripe customer not found for user." })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${CLIENT_URL}/account`,
        })

        res.json({ url: session.url })
    } catch (err) {
        console.error("Stripe Manage Subscription Error:", err)
        res.status(500).json({
            error: "Failed to create billing portal session.",
        })
    }
})

const handleStripeWebhook = asyncHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"]
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    try {
        // Helper functions
        const findUserByStripeCustomer = async (stripeCustomerId) => {
            if (!stripeCustomerId) return null
            return await User.findOne({ stripeCustomerId })
        }

        const updateFirebasePremiumClaim = async (user, isPremium) => {
            await firebaseAdmin
                .auth()
                .setCustomUserClaims(user.uid, { premium: isPremium })
        }

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object
                const firebaseUID = session.metadata?.firebaseUID
                if (!firebaseUID) break

                const user = await User.findOne({ uid: firebaseUID })
                if (!user) break

                user.isPremium = true

                const subscriptionId = session.subscription
                const sub = await stripe.subscriptions.retrieve(subscriptionId)

                if (sub?.trial_end) {
                    user.billingDate = new Date(sub.trial_end * 1000)
                    user.billingLabel = "Trial Ends On"
                }

                await user.save()
                await updateFirebasePremiumClaim(user, true)

                console.log(`[PREMIUM] ${firebaseUID} upgraded to Premium!`)
                break
            }

            case "invoice.paid": {
                const invoice = event.data.object
                const user = await findUserByStripeCustomer(invoice.customer)
                if (!user) break

                const periodEnd = invoice.lines.data[0]?.period?.end
                if (periodEnd) {
                    user.billingDate = new Date(periodEnd * 1000)
                    user.billingLabel = "Next billing date"
                    await user.save()

                    console.log(
                        `[PREMIUM] Updated billing date for ${user.uid}`
                    )
                }
                break
            }

            case "customer.subscription.deleted": {
                const sub = event.data.object
                const user = await findUserByStripeCustomer(sub.customer)
                if (!user) break

                user.isPremium = false
                user.billingDate = null
                user.billingLabel = null
                await user.save()

                await updateFirebasePremiumClaim(user, false)

                console.log(
                    `[PREMIUM] Downgraded User ${user.uid} (subscription canceled)`
                )
                break
            }

            default:
                console.log(`Unhandled Stripe event type: ${event.type}`)
        }

        res.status(200).send("Webhook received.")
    } catch (err) {
        console.error("Error processing Stripe webhook:", err)
        res.status(500).send("Webhook processing error")
    }
})

module.exports = {
    createCheckoutSession,
    createManageSession,
    handleStripeWebhook,
}
