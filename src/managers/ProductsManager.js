import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase/base";

const productsCollection = collection(db, 'products');

/// Adds a product to the database, `image` must be a `Blob` or a `File`,
/// `productData` must be an object with the following shape:
/// ```
/// {
///   name: string,
///   price: float,
///   section: string,
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
///   section: string,
///   photo: string,
/// }
/// ```
export async function addProduct(productData, image) {
    const productRef = doc(productsCollection);

    const product_id = productRef.id;
    const imageRef = ref(storage, `products/${product_id}`);

    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    productData.photo = imageUrl;
    await setDoc(productRef, productData);

    return productData;
}

/// Retrieves a list of all the products
///
/// # Returns
///
/// An Array of objects with the following shape:
/// ```
/// {
///   name: string,
///   price: float,
///   section: string,
///   photo: string,
/// }
/// ```
export async function getAllProducts() {
    const newProductsQuery = await getDocs(productsCollection);

    const newProducts = [];
    newProductsQuery.forEach((doc) => {
        newProducts.push(doc.data());
    });

    return newProducts;
}
