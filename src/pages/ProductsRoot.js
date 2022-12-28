import { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams } from "react-router-dom";
import { ShoppingCartIcon, ArrowUturnLeftIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

import { getAllSections, deleteProduct, getAllProducts, getProductsInSection } from "../managers/ProductsManager";

import useAuthStore from "../store/auth";

import GenericButton from "../components/GenericButton";
import NewSectionForm from "../components/NewSectionForm";
import NewProductForm from "../components/NewProductForm";

import ProductCard from "../components/ProductCard";
import GenericCard from "../components/GenericCard";

function SectionCard({ section }) {
    return <GenericCard img={section.photo} name={section.name}>
        <Link
            to={`section/${section.id}`}
            className=" px-4 py-2.5 bg-red-500 text-xs leading-tight uppercase rounded shadow-md hover:bg-red-600 hover:shadow-lg focus:bg-red-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out"
        >
            View section
        </Link>
    </GenericCard>
}

function SectionsRoute({ sections, isStaff }) {
    return <>
        <div className="flex flex-wrap justify-center items-center gap-5 m-5">
            {sections.map((section, i) => <SectionCard key={i} isStaff={isStaff} section={section} />)}
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

function ProductsRoute({ isStaff, sections }) {
    const [products, setProducts] = useState([]);
    const [productModal, setProductModal] = useState(false);
    const [editProduct, setEditProduct] = useState(0);

    const { sectionId } = useParams();

    useEffect(() => {
        if (sectionId === undefined) {
            getAllProducts().then(setProducts);
        } else {
            getProductsInSection(sectionId).then(setProducts);
        }
    }, [sectionId]);

    return <>
        {isStaff && <NewProductForm 
            product={products[editProduct]}
            open={productModal}
            onClose={() => setProductModal(false)}
            onNewProduct={(product) => {
                let newProducts;
                if (sectionId === undefined || product.sectionId === sectionId)
                    newProducts = products.map((c, i) => i === editProduct ? product : c);
                else
                    newProducts = products.filter((c, i) => i !== editProduct);
                setProducts(newProducts);
                setProductModal(false);
            }}
            sections={sections}
        />}
        <div className="flex m-5">
            <Link
                to={".."}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700 flex items-center justify-between"
            >
                <ArrowUturnLeftIcon className="h-6 w-6 mr-3" />
                Return to sections
            </Link>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-5 m-5">
            {products.map((product, i) => 
                <ProductCard key={i} product={product}>
                    {isStaff && <div className="flex justify-end gap-2">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded"
                            onClick={() => {
                                setEditProduct(i);
                                setProductModal(true);
                            }}
                        >
                            <PencilSquareIcon className="h-6 w-6" />
                        </button>
                        <button
                            className="bg-red-500 hover:bg-blue-700 text-white font-bold p-2 rounded"
                            onClick={() => {
                                deleteProduct(product.id);
                                const newProducts = products.filter((c) => c.id !== product.id);
                                setProducts(newProducts);
                            }}
                        >
                            <TrashIcon className="h-6 w-6" />
                        </button>
                    </div>}
                </ProductCard>
            )}
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
