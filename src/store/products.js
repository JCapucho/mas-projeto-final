import { createStore } from "./utils";

import { 
    getProductsById,
    getAllProducts,
    getProductsInSection,
    addProduct,
    editProduct,
    deleteProduct
} from "../managers/ProductsManager";

import { addLogoutHook } from "./auth";

const useProductsStore = createStore("ProductsStore", (set, get) => ({
    products: {},

    actions: {
        loadAllProducts: async () => {
            const newProducts = await getAllProducts();

            set(state => {
                const products = {...state.products};

                for (const product of newProducts)
                    products[product.id] = product;

                return { products };
            });
        },
        loadProductsInSection: async (sectionId) => {
            const newProducts = await getProductsInSection(sectionId);

            set(state => {
                const products = {...state.products};

                for (const product of newProducts)
                    products[product.id] = product;

                return { products };
            });
        },
        loadProducts: async (ids) => {
            const currentProducts = get().products;
            const deltaIds = ids.filter(id => !currentProducts.hasOwnProperty(id));

            if (deltaIds.length === 0) return;

            const newProducts = await getProductsById(deltaIds);

            set(state => {
                const products = {...state.products};

                for (const product of newProducts)
                    products[product.id] = product;

                return { products };
            });
        },
        removeAll: () => set({ products: {} }),

        addProduct: async (newProduct, image) => {
            const addedProduct = await addProduct(newProduct, image);

            set(state => {
                const products = {...state.products};

                products[addedProduct.id] = addedProduct;

                return { products };
            });
        },
        editProduct: async (id, changes, image) => {
            const editedProduct = await editProduct(id, changes, image);

            set(state => {
                const products = {...state.products};

                products[editedProduct.id] = editedProduct;

                return { products };
            });
        },
        deleteProduct: async (id) => {
            await deleteProduct(id);

            set(state => {
                const products = {...state.products};

                delete products[id];

                return { products };
            });
        }
    },
}));

addLogoutHook(() => {
    useProductsStore.getState().actions.removeAll();
});

export default useProductsStore;
