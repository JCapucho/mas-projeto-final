import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "./base.js"

export class InvalidAuthError extends Error {
    constructor() { super("Invalid login credentials") }
}

export class EmailAlreadyInUse extends Error {
    constructor() { super("The email is already in use") }
}

export class InternalError extends Error {
    constructor() { super("Internal error") }
}


export function hookAuthChanged(f) {
    onAuthStateChanged(auth, f);
}

export async function logInWithEmailAndPassword(email, password) {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, "users", res.user.uid);
        const userSnap = await getDoc(userRef);
        return userSnap.data();
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
}

export async function registerWithEmailAndPassword(email, password, firstName, lastName) {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const data = {
            email,
            firstName,
            lastName,
            staff: false
        };
        const userRef = doc(db, "users", res.user.uid);
        await setDoc(userRef, data);
        return data;
    } catch (err) {
        if (err.code === "auth/email-already-in-use")
            throw new EmailAlreadyInUse()
        else {
            console.error(err.code)
            throw new InternalError()
        }
    }
}

export function logout() {
    signOut(auth);
}
