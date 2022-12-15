import { useState, useEffect } from 'react';
import { Routes, Route, Outlet, Link, useParams } from "react-router-dom";
import { ShoppingCartIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

import { getAllSections, getAllProducts, getProductsInSection } from "../managers/ProductsManager";

import useAuthStore from "../store/auth";

import NewSectionForm from "../components/NewSectionForm";
import NewProductForm from "../components/NewProductForm";

function ProductCard({ name, photo, price, section, isStaff }) {
    return (
        <div className="rounded-lg shadow-lg bg-white p-6 w-96">
            <img className="rounded-t-lg mx-auto" style={{ maxHeight: "300px", maxWidth: "300px" }} src={photo} alt={name} />
            {isStaff && <p className="text-gray-900 text-lg text-center mb-2">section: {section.id}</p>}
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

function SectionCard({ id, name, photo, isStaff }) {
    return (
        <div className="rounded-lg shadow-lg bg-white p-6 w-96">
            <img className="rounded-t-lg mx-auto" style={{ maxHeight: "300px", maxWidth: "300px" }} src={photo} alt={name} />
            <p className="text-gray-900 text-lg text-center mb-2 mt-4">{name}</p>
            <div className="flex justify-center mt-4">
                <Link
                    to={`section/${id}`}
                    className=" px-4 py-2.5 bg-red-500 text-xs leading-tight uppercase rounded shadow-md hover:bg-red-600 hover:shadow-lg focus:bg-red-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out"
                >
                    View section
                </Link>
            </div>
        </div>
    );
}

function SectionsRoute({ sections, isStaff }) {
    return <>
        <div className="flex flex-wrap justify-center items-center gap-5 m-5 flex-col sm:flex-row">
            {sections.map((section, i) => <SectionCard key={i} isStaff={isStaff} {...section} />)}
        </div>
        <div className="flex justify-center mt-4">
            <Link
                to={"all"}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
            >
                View all
            </Link>
        </div>
    </>;
}

function ProductsRoute({ isStaff }) {
    const [products, setProducts] = useState([]);

    const { sectionId } = useParams();

    useEffect(() => {
        if (sectionId === undefined) {
            getAllProducts().then(setProducts);
        } else {
            getProductsInSection(sectionId).then(setProducts);
        }
    }, [sectionId]);

    return <>
        <div className="flex m-5">
            <Link
                to={".."}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700 flex items-center justify-between"
            >
                <ArrowUturnLeftIcon className="h-6 w-6 mr-3" />
                Return to sections
            </Link>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-5 m-5 flex-col sm:flex-row">
            {products.map((product, i) => <ProductCard key={i} isStaff={isStaff} {...product} />)}
        </div>
    </>;
}

export default function Products() {
    const user = useAuthStore(state => state.user);
    const [sections, setSections] = useState([]);

    const [sectionModal, setSectionModal] = useState(false);
    const [productModal, setProductModal] = useState(false);

    const isStaff = user?.staff === true;

    useEffect(() => {
        getAllSections().then(setSections);
    }, []);

    return <>
        {isStaff &&
            <>
                <NewSectionForm open={sectionModal} onClose={() => setSectionModal(false)} added={(doc) => setSections(old => [...old, doc])} />
                <NewProductForm open={productModal} onClose={() => setProductModal(false)} sections={sections} />
                <div className="flex flex-wrap justify-end gap-5 m-5">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setSectionModal(true)}
                    >
                        Add Section
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setProductModal(true)}
                    >
                        Add Product
                    </button>
                </div>
            </>
        }
        <Routes>
            <Route index element={<SectionsRoute sections={sections} isStaff={isStaff} />} />
            <Route path="section/:sectionId" element={<ProductsRoute isStaff={isStaff} />} />
            <Route path="all" element={<ProductsRoute isStaff={isStaff} />} />
        </Routes>

        <Outlet />
    </>;
}
