"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJux9rbsI918-GH2HCAQHPFHVJJo5h9Kg",
  authDomain: "eldonitor.firebaseapp.com",
  projectId: "eldonitor",
  storageBucket: "eldonitor.firebasestorage.app",
  messagingSenderId: "39348452292",
  appId: "1:39348452292:web:a0106aaf9dd89c8e070291",
  measurementId: "G-4FP9K8HXKL"
};

// Initialize Firebase, making sure it only initializes once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
