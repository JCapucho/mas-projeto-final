import { collection, doc, getDocs, setDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/base";

import { usersCollection } from "./UserManager";

export const animalsCollection = collection(db, 'animals');

/// Retrieves a list of all the animals beloging to the user
///
/// # Returns
///
/// An Array of objects with the following shape:
/// ```
/// {
///   id: string,
///   name: string,
///   height: number,
///   weight: number,
///   born: Date,
///   subscriptionStart: Date,
///   owner: FirebaseDocRef,
/// }
/// ```
export async function getUserAnimals(userId) {
    const userRef = doc(usersCollection, userId);
    const q = query(animalsCollection, where("owner", "==", userRef));
    const animalsQuery = await getDocs(q);

    const animals = [];
    animalsQuery.forEach((doc) => {
        const animal = doc.data();
        animal.id = doc.id;
        animal.born = animal.born.toDate();
        animal.subscriptionStart = animal.subscriptionStart.toDate();
        animals.push(animal);
    });

    return animals;
}

/// Adds a new animal to the database
///
/// # Inputs
///
/// - `data`:
/// ```
/// {
///   name: string,
///   weight: number,
///   height: number,
///   born: Date,
/// }
/// ```
///
/// - `userId`: `string`
///
/// # Returns
///
/// An object with the following shape:
/// ```
/// {
///   id: string,
///   name: string,
///   height: number,
///   weight: number,
///   born: Date,
///   subscriptionStart: Date,
///   owner: FirebaseDocRef,
/// }
/// ```
export async function newAnimal(userId, data) {
    const ownerRef = doc(usersCollection, userId);
    const animalRef = doc(animalsCollection);

    data.owner = ownerRef;
    data.subscriptionStart = new Date();

    await setDoc(animalRef, data);
    data.id = animalRef.id;

    return data;
}
