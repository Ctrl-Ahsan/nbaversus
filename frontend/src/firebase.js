import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
    apiKey: "AIzaSyAYuRmEHiWsFkvbviNkY26qgSy6_qwv9ns",
    authDomain: "nba-versus.firebaseapp.com",
    projectId: "nba-versus",
    storageBucket: "nba-versus.firebasestorage.app",
    messagingSenderId: "261507033869",
    appId: "1:261507033869:web:1aea2c669bb19eebcede44",
    measurementId: "G-X2HCZ1D140",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const analytics = getAnalytics(app)
