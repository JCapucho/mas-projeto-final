import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

export function hookAuthChanged(f) {
    onAuthStateChanged(auth, f);
}

export class InvalidAuthError extends Error {
    constructor() { super("Invalid login credentials") }
}

export class EmailAlreadyInUse extends Error {
    constructor() { super("The email is already in use") }
}

export class InternalError extends Error {
    constructor() { super("Internal error") }
}

export async function logInWithEmailAndPassword(email, password) {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res
    } catch (err) {
        if (err.code === "auth/user-not-found")
            throw new InvalidAuthError()
        if (err.code === "auth/wrong-password")
            throw new InvalidAuthError()
        else {
            console.error(err.code);
            throw new InternalError()
        }
    }
};

export async function registerWithEmailAndPassword(email, password, firstName, lastName) {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            authProvider: "local",
            email,
            firstName,
            lastName,
        });
    } catch (err) {
        if (err.code === "auth/email-already-in-use")
            throw new EmailAlreadyInUse()
        else {
            console.error(err.code)
            throw new InternalError()
        }
    }
};

export function logout() {
    signOut(auth);
};
