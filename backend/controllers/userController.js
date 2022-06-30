const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asycHandler = require("express-async-handler")
const User = require("../models/userModel")

const registerUser = asycHandler(async (req, res) => {
    const { name, password } = req.body

    // Check if all fields are present
    if (!name || !password) {
        res.status(400)
        throw new Error("Please fill in all fields")
    }

    // Check if user already exists
    const userExists = await User.findOne({ name })
    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        password: hashedPassword,
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            Name: user.name,
            Token: generateToken(user.id),
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})

const loginUser = asycHandler(async (req, res) => {
    const { name, password } = req.body

    const user = await User.findOne({ name })
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            Name: user.name,
            Token: generateToken(user.id),
        })
    } else {
        res.status(400)
        throw new Error("Invalid credentials")
    }
})

const getMe = asycHandler(async (req, res) => {
    res.status(200).json(req.user)
})

const updateMe = asycHandler(async (req, res) => {
    const me = await User.findById(req.user.id)

    if (req.body.password) {
        samePassword = await bcrypt.compare(req.body.password, me.password)
        if (samePassword) {
            throw new Error("You already have these credentials")
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        me.password = hashedPassword
        me.save()
        res.status(200).json({ hashedPW: hashedPassword, mePW: me.password })
    }
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateMe,
}
