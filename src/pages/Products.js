import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { ArrowUturnLeftIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

import useAuthStore from "../store/auth";
import useProductStore from "../store/products";

import NewProductForm from "../components/NewProductForm";

import ProductCard from "../components/ProductCard";

export default function ProductsRoute() {
    const isStaff = useAuthStore(state => state.user?.staff === true);
    const [products, actions] = useProductStore(state => [
        state.products,
        state.actions
    ]);

    const [productModal, setProductModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const { sectionId } = useParams();

    useEffect(() => {
        if (sectionId === undefined)
            actions.loadAllProducts()
        else
            actions.loadProductsInSection(sectionId)
    }, [sectionId, actions]);

    return <>
        {isStaff && <NewProductForm
            product={products[editProduct]}
            open={productModal}
            onClose={() => setProductModal(false)}
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
            {Object.values(products).map((product, i) => 
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
                            onClick={() => actions.deleteProduct(product.id)}
                        >
                            <TrashIcon className="h-6 w-6" />
                        </button>
                    </div>}
                </ProductCard>
            )}
        </div>
    </>;
}

