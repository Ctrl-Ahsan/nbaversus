const firebaseAdmin = require("firebase-admin")
const serviceAccount = require("./firebase-service-account.json")

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
})

module.exports = firebaseAdmin
