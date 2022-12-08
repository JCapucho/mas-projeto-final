import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBcWGuh8cXzD9QsFyyUR6jTYFe7qEkSIL4",
    authDomain: "projeto-final-mas.firebaseapp.com",
    projectId: "projeto-final-mas",
    storageBucket: "projeto-final-mas.appspot.com",
    messagingSenderId: "63346853312",
    appId: "1:63346853312:web:53462ceb42cd3e3156f425"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }
