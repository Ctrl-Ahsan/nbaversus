const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asycHandler = require("express-async-handler")
const User = require("../models/userModel")

const registerUser = asycHandler(async (req, res) => {
    const { name, password } = req.body
    let now = new Date().toLocaleString("en-US", { timeZone: "UTC" })

    // Check if all fields are present
    if (!name || !password) {
        console.log(
            now +
                " | User tried submitting form without filling in all fields | " +
                req.ip
        )
        res.status(400).send("Please fill in all fields")
        return
    }

    // Check if user already exists
    const userExists = await User.findOne({ name })
    if (userExists) {
        console.log(
            now +
                " | A user tried taking a taken name: " +
                name +
                " | " +
                req.ip
        )
        res.status(400).send("This name is already taken")
        return
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
        console.log(`${now} ${user} created`)
        res.status(201).json({
            _id: user.id,
            Name: user.name,
            Token: generateToken(user.id),
        })
    } else {
        res.status(400)
        console.log(now + " | Couldn't create account")
        throw new Error("Invalid user data")
    }
})

const loginUser = asycHandler(async (req, res) => {
    const { name, password } = req.body
    let now = new Date().toLocaleString("en-US", { timeZone: "UTC" })

    const user = await User.findOne({ name })
    if (user && (await bcrypt.compare(password, user.password))) {
        console.log(`${now} | ${user.name} logged in | ${req.ip}`)
        res.json({
            _id: user.id,
            Name: user.name,
            Token: generateToken(user.id),
        })
    } else {
        console.log(
            `${now} | Attempted login with invalid credentials | ${req.ip}`
        )
        res.status(400).send("Invalid credentials")
        return
    }
})

const getMe = asycHandler(async (req, res) => {
    let now = new Date().toLocaleString("en-US", { timeZone: "UTC" })
    console.log(`${now} | ${req.user.name} requested their profile | ${req.ip}`)
    res.status(200).json(req.user)
})

const updateMe = asycHandler(async (req, res) => {
    const me = await User.findById(req.user.id)

    if (req.body.password) {
        samePassword = await bcrypt.compare(req.body.password, me.password)
        if (samePassword) {
            res.status(400).send("You already have these credentials")
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        me.password = hashedPassword
        me.save()
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
