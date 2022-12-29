import { createStore } from "./utils";

import { getProductsById } from "../managers/ProductsManager";

import useAuthStore, { addLogoutHook } from "./auth";

const useProductsStore = createStore("ProductsStore", (set, get) => ({
    products: {},

    actions: {
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
        removeAll: () => set({ products: {} })
    },
}));

addLogoutHook(() => {
    useProductsStore.getState().actions.removeAll();
});

export default useProductsStore;
