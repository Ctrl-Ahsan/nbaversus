const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const uri =
            process.env.NODE_ENV === "development"
                ? process.env.MONGO_URI_DEV
                : process.env.MONGO_URI

        const conn = await mongoose.connect(uri)
        console.log(`MongoDB connected: ${conn.connection.host}`.cyan)
    } catch (error) {
        console.log(error.red)
        process.exit(1)
    }
}

module.exports = connectDB
