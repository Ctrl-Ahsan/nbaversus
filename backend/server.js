const express = require("express")
const rateLimit = require("express-rate-limit")
const dotenv = require("dotenv").config({ path: "../.env" })
const colors = require("colors")
const { errorHandler } = require("./middleware/errorMiddleware")
const connectDB = require("./config/db")

const app = express()
connectDB()

// Rate limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 requests per windowMs
})
app.use(limiter)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(errorHandler)

app.use("/api/votes", require("./routes/voteRoutes"))
app.use("/api/users", require("./routes/userRoutes"))

const port = process.env.PORT || 3000
app.listen(port, () => console.log("Server started on port " + port))
