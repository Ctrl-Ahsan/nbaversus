const asyncHandler = require("express-async-handler")
const firebaseAdmin = require("../firebaseAdmin")
const User = require("../models/userModel")

const optionalAuth = asyncHandler(async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1]

            // Verify token
            const decoded = await firebaseAdmin.auth().verifyIdToken(token)

            // Get user from the token
            req.user = await User.findOne({ uid: decoded.uid })

            next()
        } catch (error) {
            console.log(error)
            next()
        }
    } else {
        next()
    }
})

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1]

            // Verify token
            const decoded = await firebaseAdmin.auth().verifyIdToken(token)

            // Get user from the token
            req.user = await User.findOne({ uid: decoded.uid })

            if (!req.user) {
                return res.status(401).json("User not found in database")
            }

            next()
        } catch (error) {
            console.log(error)
            res.status(401).json("Not authorized.")
        }
    } else {
        res.status(401).json("Not authorized, no token")
    }
})

const admin = (req, res, next) => {
    const apiKey = req.header("x-api-key")
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: "Forbidden: Invalid API Key" })
    }
    next()
}

module.exports = { optionalAuth, protect, admin }
