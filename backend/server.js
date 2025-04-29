const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const path = require("path")
require("dotenv").config()
const colors = require("colors")
const { errorHandler } = require("./middleware/errorMiddleware")
const { upgradeUser } = require("./controllers/paymentController.js")
const bodyParser = require("body-parser")
const connectDB = require("./db")
const port = process.env.PORT || 3000

// initialize
connectDB()
const app = express()

// Rate limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // limit each IP to 30 requests per windowMs
})

// Stripe webhook
app.post(
    "/api/webhook",
    bodyParser.raw({ type: "application/json" }),
    upgradeUser
)

// configure
app.enable("trust proxy")
app.use(cors())
app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/api", require("./routes"))
app.use(errorHandler)

// Serve frontend
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")))

    app.get("*", (req, res) =>
        res.sendFile(
            path.resolve(__dirname, "../", "frontend", "build", "index.html")
        )
    )
} else {
    app.get("/", (req, res) => res.send("Please set to production"))
}

app.listen(port, () => console.log("Server started on port " + port))
