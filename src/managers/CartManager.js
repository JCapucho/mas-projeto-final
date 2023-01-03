import { collection, doc, getDocs, getDoc, setDoc, updateDoc, query, where, runTransaction } from "firebase/firestore";
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
        cart.lastDate = cart.lastDate.toDate() ?? null;
        cart.nextDate = cart.nextDate?.toDate() ?? null;
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

    cart.lastDate = cart.lastDate?.toDate() ?? null;
    cart.nextDate = cart.nextDate?.toDate() ?? null;

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

/// Saves the user's draft card as a permanent cart
export async function storeDraftCart(userId) {
    const ownerRef = doc(usersCollection, userId);
    const cartRef = doc(cartsCollection);
    const draftCartRef = doc(ownerRef, "private", "cart");

    return await runTransaction(db, async (transaction) => {
        const cartDoc = await transaction.get(draftCartRef);
        const data = cartDoc.data();

        data.owner = ownerRef;
        data.recurring = data.recurring ?? false;
        data.lastDate = new Date();

        transaction.set(cartRef, data);
        transaction.delete(draftCartRef);

        return data;
    });
}

/// Edits a cart in the database.
//
/// # Inputs
///
/// - `cartData`:
/// ```
/// {
///   recurring: boolean,
///   lastDate: Date,
///   nextDate: Date,
///   products: { product: quantity },
/// }
/// ```
///
/// # Returns
///
/// An object with the following shape:
/// ```
/// {
///   name: string,
///   price: float,
///   sectionId: string,
///   section: FirebaseDocRef,
///   photo: string,
/// }
/// ```
export async function updateCart(id, cartData) {
    const cartRef = doc(cartsCollection, id);

    await updateDoc(cartRef, cartData);

    const snap = await getDoc(cartRef);
    const data = snap.data();

    data.id = id;
    data.lastDate = data.lastDate.toDate();
    data.nextDate = data.nextDate?.toDate();

    return data;
}
