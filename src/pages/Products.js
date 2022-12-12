import { useState, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, updateDoc, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase/base";

import useAuthStore from "../store/auth";

function NewProductForm({ added }) {
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);

    const handleFileSelected = (e) => {
        setImage(e.target.files[0])
    }

    async function submit(event) {
        event.preventDefault();
        const priceFloat = parseFloat(price);

        const productData = {
            name,
            photo: "",
            price: priceFloat,
            section: "Alimentos"
        };

        const productsCollection = collection(db, 'products');
        const productDoc = await addDoc(productsCollection, productData);

        const product_id = productDoc.id;

        const imageRef = ref(storage, `products/${product_id}`);

        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);

        productData.photo = imageUrl;
        await updateDoc(productDoc, { photo: productData.photo });

        added(productData);
    }

    return <div className="flex justify-center">
        <form onSubmit={submit} className="flex items-center flex-col gap-3">
            <h1 className="text-xl font-bold text-center">Add product</h1>
            <div className="w-full">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name
                </label>
                <textarea
                    id="name"
                    type="text"
                    placeholder="Product name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows="1"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />
            </div>
            <div className="w-full">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                </label>
                <input
                    id="price"
                    type="number"
                    placeholder="Price"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    required
                />
            </div>
            <div className="w-full">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Image
                </label>
                <input
                    id="image"
                    className="border-gray-300 border rounded-md
                    file:mr-5 file:py-2 file:px-6
                    file:rounded-l-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-gray-700 file:text-white
                    hover:file:cursor-pointer hover:file:bg-gray-900
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    type="file"
                    onChange={handleFileSelected}
                    required />
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit">
                Adicionar produto
            </button>
        </form>
    </div>
}

function ProductCard({ name, photo, price }) {
    return (
        <div className="rounded-lg shadow-lg bg-white p-6 w-96">
            <img className="rounded-t-lg mx-auto" style={{ maxHeight: "300px", maxWidth: "300px" }} src={photo} alt={name} />
            <p className="text-gray-900 text-lg text-center mb-2 mt-4">{name}</p>
            <h5 className="text-gray-900 text-xl text-center font-bold mb-2">{price.toFixed(2)}€</h5>
            <div className="flex justify-center mt-4">
                <button type="button" className=" px-4 py-2.5 bg-red-500 text-xs leading-tight uppercase rounded shadow-md hover:bg-red-600 hover:shadow-lg focus:bg-red-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out flex items-center justify-between">
                    Add to cart
                    <ShoppingCartIcon className="h-6 w-6 ml-3" />
                </button>
            </div>
        </div>
    );
}

export default function Products() {
    const user = useAuthStore(state => state.user);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            const productsCollection = collection(db, 'products');

            const newProductsQuery = await getDocs(productsCollection);

            const newProducts = [];
            newProductsQuery.forEach((doc) => {
                newProducts.push(doc.data());
            });
            setProducts(newProducts);
        }

        fetchProducts();
    }, []);

    return <>
        <div className="flex flex-wrap justify-center items-center gap-5 m-5 flex-col sm:flex-row">
            {products.map((product, i) => <ProductCard key={i} {...product} />)}
        </div>
        {user?.staff && <NewProductForm added={(doc) => setProducts(old => [...old, doc])} />}
    </>;
}
