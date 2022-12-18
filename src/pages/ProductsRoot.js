import { useState, useEffect } from 'react';
import { ShoppingCartIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { Routes, Route, Link, useParams } from "react-router-dom";

import { getAllSections, getAllProducts, getProductsInSection } from "../managers/ProductsManager";

import useAuthStore from "../store/auth";

import GenericButton from "../components/GenericButton";
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
        <div className="self-stretch rounded-lg shadow-lg bg-white p-6 w-96 flex flex-col justify-between">
            <img className="rounded-t-lg mx-auto" style={{ maxHeight: "300px", maxWidth: "300px" }} src={photo} alt={name} />
            <div className="flex justify-center items-center mt-4 flex-col">
                <p className="text-gray-900 text-lg text-center mb-2 mt-4">{name}</p>
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
        <div className="flex flex-wrap justify-center items-center gap-5 m-5">
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

    return <div className="mx-auto max-w-7xl">
        {isStaff &&
            <>
                <NewSectionForm open={sectionModal} onClose={() => setSectionModal(false)} added={(doc) => setSections(old => [...old, doc])} />
                <NewProductForm open={productModal} onClose={() => setProductModal(false)} sections={sections} />

                <div className="flex flex-wrap justify-end gap-5 m-5 pb-5 items-end justify-between border-b-2">
                    <h1 className="text-red-500 text-2xl font-bold">Staff only</h1>
                    <div>
                        <GenericButton className="mr-5" onClick={() => setSectionModal(true)}>
                            Add Section
                        </GenericButton>
                        <GenericButton onClick={() => setProductModal(true)}>
                            Add Product
                        </GenericButton>
                    </div>
                </div>
            </>
        }

        <Routes>
            <Route index element={<SectionsRoute sections={sections} isStaff={isStaff} />} />
            <Route path="section/:sectionId" element={<ProductsRoute isStaff={isStaff} sections={sections} />} />
            <Route path="all" element={<ProductsRoute isStaff={isStaff} sections={sections} />} />
        </Routes>
    </div>;
}
