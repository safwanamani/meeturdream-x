import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";
// import * as app from 'firebase/app'
// import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSy",
  authDomain: "m",
  projectId: "mda",
  storageBucket: "mt.com",
  messagingSenderId: "8541040",
  appId: "1:854104",
  measurementId: "G-S6P4X9CYBZ"
};

// Initialize Firebase
// export const appl = initializeApp(firebaseConfig);
export const appl = initializeApp(firebaseConfig)
export const storage = getStorage(appl);
// export const firestore = app.firestore()

