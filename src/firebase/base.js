import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

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
const storage = getStorage(app);

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.log("Running firebase with emulators");
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
}

export { auth, db, storage }
