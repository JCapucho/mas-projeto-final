import { logInWithEmailAndPassword, registerWithEmailAndPassword, logout } from "../firebase/auth";

import { createUser, getUser } from "./UserManager";

/// Registers a new user
///
/// # Returns
///
/// An object with the following shape:
/// ```
/// {
///   id: string,
///   email: string,
///   firstName: string,
///   lastName: string,
///   staff: boolean,
///   medic: boolean,
/// }
/// ```
export async function register(email, password, firstName, lastName) {
    const res = await registerWithEmailAndPassword(email, password, firstName, lastName);
    return await createUser(res.user.uid, email, firstName, lastName);
}

/// Logs in as a user
///
/// # Returns
///
/// An object with the following shape:
/// ```
/// {
///   id: string,
///   email: string,
///   firstName: string,
///   lastName: string,
///   staff: boolean,
///   medic: boolean,
/// }
/// ```
export async function login(email, password) {
    const res = await logInWithEmailAndPassword(email, password);
    return await getUser(res.user.uid);
}

/// Logs out the current user
export { logout };
