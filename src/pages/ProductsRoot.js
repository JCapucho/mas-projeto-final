import { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import useAuthStore from "../store/auth";

import GenericButton from "../components/GenericButton";
import NewSectionForm from "../components/NewSectionForm";
import NewProductForm from "../components/NewProductForm";

import SectionsRoute from "./Sections";
import ProductsRoute from "./Products";

export default function Products() {
    const user = useAuthStore(state => state.user);

    const [sectionModal, setSectionModal] = useState(false);
    const [productModal, setProductModal] = useState(false);

    const isStaff = user?.staff === true;

    return <div className="mx-auto max-w-7xl">
        {isStaff &&
            <>
                <NewSectionForm open={sectionModal} onClose={() => setSectionModal(false)} />
                <NewProductForm open={productModal} onClose={() => setProductModal(false)} />

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
            <Route index element={<SectionsRoute />} />
            <Route path="section/:sectionId" element={<ProductsRoute />} />
            <Route path="all" element={<ProductsRoute />} />
        </Routes>
    </div>;
}
