import { initializeApp } from "@firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging"

const firebaseConfig = {
    apiKey: "AIzaSy",
    authDomain: "m",
    projectId: "mda",
    storageBucket: "mt.com",
    messagingSenderId: "8541040",
    appId: "1:854104",
    measurementId: "G-S6P4X9CYBZ"
  };

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const fetchToken = (setTokenFound) => {
    return getToken(messaging, { vapidKey: "TZxoo9QjJWRYmo4UWGvzWHcwcybVP2-Qr5Zus" }).then((currentToken) => {
        if (currentToken) {
            setTokenFound(true)
        } else {
            console.log('No registration token available. Request permission to generate one.');
            setTokenFound(false);
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    })
}

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload)
        })
    })