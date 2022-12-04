import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

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

async function logInWithEmailAndPassword(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

async function registerWithEmailAndPassword(name, email, password) {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

function logout() {
    signOut(auth);
};

export { auth, logInWithEmailAndPassword, registerWithEmailAndPassword, logout }
