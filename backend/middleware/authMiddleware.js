const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")

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
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from the token
            req.user = await User.findById(decoded.id).select("-password")

            next()
        } catch (error) {
            console.log(error)
            res.status(401).json("Not authorized.")
        }
    }

    if (!token) {
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

module.exports = { protect, admin }
