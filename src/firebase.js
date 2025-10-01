// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqYrLsnkpOOQ3KdmM6j1q_pjU3pDT2IbM",
    authDomain: "twitter-app-34c78.firebaseapp.com",
    projectId: "twitter-app-34c78",
    storageBucket: "twitter-app-34c78.firebasestorage.app",
    messagingSenderId: "623535766163",
    appId: "1:623535766163:web:0a07844b011f31e2a0eb66"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)