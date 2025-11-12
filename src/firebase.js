// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBaCK0ymBvCgsQzEyJsRZs_phahisccdJo",
    authDomain: "bloodsugartracker-76e12.firebaseapp.com",
    databaseURL: "https://bloodsugartracker-76e12-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bloodsugartracker-76e12",
    storageBucket: "bloodsugartracker-76e12.firebasestorage.app",
    messagingSenderId: "1059902934978",
    appId: "1:1059902934978:web:e93e288113642e331c505b",
    measurementId: "G-JQT2X43F0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;