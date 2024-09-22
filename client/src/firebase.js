// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth ,GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGvjw2GirED9i2PZylJWXOojtoTBJAe0g",
  authDomain: "stream-buddy-16f1a.firebaseapp.com",
  projectId: "stream-buddy-16f1a",
  storageBucket: "stream-buddy-16f1a.appspot.com",
  messagingSenderId: "76117566000",
  appId: "1:76117566000:web:ee688b45e8127a0bdf83f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const provider = new GoogleAuthProvider()
export default app