import { collection, doc, getDoc, setDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/base";

export const usersCollection = collection(db, 'users');

/// Retrieves the user information for the user with the provided id
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
export async function getUser(id) {
    const userRef = doc(usersCollection, id);
    const userSnap = await getDoc(userRef);

    const user = userSnap.data();
    user.id = id;

    return user;
}

/// Creates a new user with the provided id and information
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
export async function createUser(id, email, firstName, lastName) {
    const data = {
        email,
        firstName,
        lastName,
        staff: false,
        medic: false,
    };
    const userRef = doc(usersCollection, id);
    await setDoc(userRef, data);
    data.id = id;
    return data;
}

/// Retrieves all medics
///
/// # Returns
///
/// An Array of objects with the following shape:
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
export async function getAllMedics() {
    const q = query(usersCollection, where("medic", "==", true));
    const usersQuery = await getDocs(q);

    const users = [];
    usersQuery.forEach((doc) => {
        const user = doc.data();
        user.id = doc.id;
        users.push(user);
    });

    return users;
}

