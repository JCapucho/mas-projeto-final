import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/base";

const locationsCollection = collection(db, 'locations');

/// Retrieves a list of all the locations
///
/// # Returns
///
/// An Array of objects with the following shape:
/// ```
/// {
///   id: string,
///   name: string,
/// }
/// ```
export async function getAllLocations() {
    const locationsQuery = await getDocs(locationsCollection);

    const locations = [];
    locationsQuery.forEach((doc) => {
        const location = doc.data();
        location.id = doc.id;
        locations.push(location);
    });

    return locations;
}
