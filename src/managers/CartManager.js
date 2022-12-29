import { collection, doc, getDocs, getDoc, setDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/base";

import { usersCollection } from "./UserManager";
const cartsCollection = collection(db, 'carts');

/// Retrieves a list of all the carts belonging to the user
///
/// # Returns
///
/// An Array of objects with the following shape:
/// ```
/// {
///   id: string,
///   owner: FirebaseDocRef,
///   recurring: boolean,
///   lastDate: Date,
///   nextDate: Date,
///   products: { product: quantity },
/// }
/// ```
export async function getUserCarts(userId) {
    const userRef = doc(usersCollection, userId);
    const q = query(cartsCollection, where("owner", "==", userRef));
    const cartsQuery = await getDocs(q);

    const carts = [];
    cartsQuery.forEach((doc) => {
        const cart = doc.data();
        cart.id = doc.id;
        cart.lastDate = cart.lastDate.toDate();
        cart.nextDate = cart.nextDate.toDate();
        carts.push(cart);
    });

    return carts;
}

/// Retrieves the user's current draft cart
///
/// # Returns
///
/// An object with the following shape:
/// ```
/// {
///   owner: FirebaseDocRef,
///   recurring: boolean,
///   nextDate?: Date,
///   products: { product: quantity },
/// }
/// ```
export async function getUserCartDraft(userId) {
    const cartRef = doc(usersCollection, userId, "private", "cart");
    const cartSnap = await getDoc(cartRef);

    const cart = cartSnap.data() || {
        owner: doc(usersCollection, userId),
        recurring: false,
        products: {}
    };

    return cart;
}

/// Saves `cart` as the user's cart draft
///
/// # Inputs
///
/// - `cart`:
///
/// ```
/// {
///   owner: FirebaseDocRef,
///   recurring: boolean,
///   nextDate?: Date,
///   products: { product: quantity },
/// }
/// ```
export async function saveUserCartDraft(userId, cart) {
    const cartRef = doc(usersCollection, userId, "private", "cart");
    await setDoc(cartRef, cart);
}

