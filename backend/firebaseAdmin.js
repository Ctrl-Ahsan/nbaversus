const firebaseAdmin = require("firebase-admin")
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
})

module.exports = firebaseAdmin
