const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode)
    res.json({
        message: "Something went wrong",
        error: process.env.NODE_ENV === "production" ? null : err.stack,
    })
}

module.exports = {
    errorHandler,
}
