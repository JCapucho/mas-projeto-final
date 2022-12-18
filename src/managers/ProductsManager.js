import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, updateDoc, setDoc, getDocs, getDoc, deleteDoc, query, where } from "firebase/firestore";
import { db, storage } from "../firebase/base";

const sectionsCollection = collection(db, 'sections');
const productsCollection = collection(db, 'products');

/// Adds a section to the database, `image` must be a `Blob` or a `File`,
/// `sectionData` must be an object with the following shape:
/// ```
/// {
///   name: string,
/// }
/// ```
///
/// # Returns
///
/// An object with the following shape:
/// ```
/// {
///   name: string,
///   photo: string,
/// }
/// ```
export async function addSection(sectionData, image) {
    const sectionRef = doc(sectionsCollection);

    const section_id = sectionRef.id;
    const imageRef = ref(storage, `sections/${section_id}`);

    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    sectionData.photo = imageUrl;
    await setDoc(sectionRef, sectionData);

    return sectionData;
}

/// Adds a product to the database, `image` must be a `Blob` or a `File`,
/// `productData` must be an object with the following shape:
/// ```
/// {
///   name: string,
///   price: float,
///   sectionId: string,
/// }
/// ```
///
/// # Returns
///
/// An object with the following shape:
/// ```
/// {
///   id: string,
///   name: string,
///   price: float,
///   sectionId: string,
///   section: FirebaseDocRef,
///   photo: string,
/// }
/// ```
export async function addProduct(productData, image) {
    const productRef = doc(productsCollection);

    productData.section = doc(sectionsCollection, productData.sectionId);

    const product_id = productRef.id;
    const imageRef = ref(storage, `products/${product_id}`);

    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    productData.photo = imageUrl;
    await setDoc(productRef, productData);

    productData.id = product_id;
    return productData;
}

/// Edits a product in the database, `image` must be a `Blob`, `File` or `null`,
/// `productData` must be an object with the following shape:
/// ```
/// {
///   id: string,
///   name?: string,
///   price?: float,
///   sectionId?: string,
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
export async function editProduct(id, productData, image) {
    const productRef = doc(productsCollection, id);

    if (productData.sectionId)
        productData.section = doc(sectionsCollection, productData.sectionId);

    if (image !== null) {
        const imageRef = ref(storage, `products/${id}`);

        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);

        productData.photo = imageUrl;
    }

    await updateDoc(productRef, productData);

    const snap = await getDoc(productRef);
    const data = snap.data();

    data.id = id;

    return data;
}

/// Deletes a product from the database
export async function deleteProduct(id) {
    const productRef = doc(productsCollection, id);

    return await deleteDoc(productRef);
}

/// Retrieves a list of all the products
///
/// # Returns
///
/// An Array of objects with the following shape:
/// ```
/// {
///   id: string,
///   name: string,
///   price: float,
///   section: FirebaseDocRef,
///   photo: string,
/// }
/// ```
export async function getAllProducts() {
    const productsQuery = await getDocs(productsCollection);

    const products = [];
    productsQuery.forEach((doc) => {
        const product = doc.data();
        product.id = doc.id;
        products.push(product);
    });

    return products;
}

/// Retrieves a list of all the sections
///
/// # Returns
///
/// An Array of objects with the following shape:
/// ```
/// {
///   id: string,
///   name: string,
///   photo: string,
/// }
/// ```
export async function getAllSections() {
    const sectionQuery = await getDocs(sectionsCollection);

    const sections = [];
    sectionQuery.forEach((doc) => {
        const section = doc.data();
        section.id = doc.id;
        sections.push(section);
    });

    return sections;
}

/// Retrieves a list of all the products in the section defined by id
///
/// # Returns
///
/// An Array of objects with the following shape:
/// ```
/// {
///   id: string,
///   name: string,
///   price: float,
///   section: FirebaseDocRef,
///   sectionId: string,
///   photo: string,
/// }
/// ```
export async function getProductsInSection(id) {
    const q = query(productsCollection, where("section", "==", doc(sectionsCollection, id)));
    const productsQuery = await getDocs(q);

    const products = [];
    productsQuery.forEach((doc) => {
        const product = doc.data();
        product.id = doc.id;
        products.push(product);
    });

    return products;
}
