import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

import useAuthStore from "../store/auth";
import useProductStore from "../store/products";

import NewProductForm from "../components/NewProductForm";
import ProductCard from "../components/ProductCard";

import { LoadingComponent } from "../utils";

export default function ProductsRoute() {
    const { sectionId } = useParams();
    const isStaff = useAuthStore(state => state.user?.staff === true);
    const [products, actions] = useProductStore(state => [
        sectionId === undefined
            ? Object.values(state.products)
            : Object.values(state.products).filter(product => product.section.id === sectionId),
        state.actions
    ]);

    const [productModal, setProductModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (sectionId === undefined)
            actions.loadAllProducts().then(() => setLoading(false))
        else
            actions.loadProductsInSection(sectionId).then(() => setLoading(false))
    }, [sectionId, actions]);

    return <>
        {isStaff && <NewProductForm
            product={products[editProduct]}
            open={productModal}
            onClose={() => setProductModal(false)}
        />}
        <LoadingComponent loading={loading}>
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
                    <ProductCard key={i} product={product} edit={() => {
                        setEditProduct(i);
                        setProductModal(true);
                    }} />
                )}
            </div>
        </LoadingComponent>
    </>;
}

