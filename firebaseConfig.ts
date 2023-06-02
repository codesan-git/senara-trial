// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiCBoHP8fyAPKn-LCRLuPpomB0N8U4FIs",
  authDomain: "senara-project.firebaseapp.com",
  projectId: "senara-project",
  storageBucket: "senara-project.appspot.com",
  messagingSenderId: "1049158729865",
  appId: "1:1049158729865:web:bbb548a82016d5c6c60658",
  measurementId: "G-F8DLG3Q372"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage()