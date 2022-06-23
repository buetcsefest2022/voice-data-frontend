// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3JOOtYea67U9zcQCxhFVqY1p3_hr_FkA",
  authDomain: "audio-data-firebase.firebaseapp.com",
  projectId: "audio-data-firebase",
  storageBucket: "audio-data-firebase.appspot.com",
  messagingSenderId: "739402323556",
  appId: "1:739402323556:web:646786193f56fe64a0f171"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

const auth = getAuth(app);

export default storage;
export { auth };

export const db = getFirestore(app);