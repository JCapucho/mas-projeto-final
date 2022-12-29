import { createStore } from "./utils";

import { getUserCarts, getUserCartDraft, saveUserCartDraft } from "../managers/CartManager";

import useAuthStore, { addLogoutHook } from "./auth";

const useCartStore = createStore("CartsStore", (set, get) => ({
    dirty: false,
    currentCart: {},
    carts: [],

    productsInCart: (cart) =>
        Object.values(cart.products || {}).reduce((accum, value) => accum + value, 0),

    actions: {
        addProduct: async (product) => set(state => {
            const cartProducts = { ...state.currentCart.products };

            if(!cartProducts[product])
                cartProducts[product] = 0;

            cartProducts[product] += 1;

            return {
                dirty: true,
                currentCart: { ...state.currentCart, products: cartProducts }
            };
        }),
        removeProduct: (product) => set(state => {
            const cartProducts = { ...state.currentCart.products };

            delete cartProducts[product];

            return {
                dirty: true,
                currentCart: { ...state.currentCart, products: cartProducts }
            };
        }),
        changeQuantity: (product, quantity) => set(state => {
            const cartProducts = { ...state.currentCart.products };

            cartProducts[product] = quantity;

            return {
                dirty: true,
                currentCart: { ...state.currentCart, products: cartProducts }
            };
        }),

        loadUserCarts: async (userId) => {
            const [carts, draft] = await Promise.all([
                getUserCarts(userId),
                getUserCartDraft(userId),
            ]);

            set({ dirty: false, currentCart: draft, carts });
        },
        removeAll: () => set({ dirty: false, currentCart: {}, carts: [] }),
        saveDraft: async (user) => {
            const state = get();

            if (!state.dirty) return;

            await saveUserCartDraft(user.id, state.currentCart);
            set({ dirty: false })
        }
    },
}));

async function saveDraft() {
    const user = useAuthStore.getState().user;
    useCartStore.getState().actions.saveDraft(user);
}

addLogoutHook(async () => {
    await saveDraft();
    useCartStore.getState().actions.removeAll();
});

useAuthStore.subscribe(state => {
    if (state.user !== null)
        useCartStore.getState().actions.loadUserCarts(state.user.id);
});

document.addEventListener('visibilitychange', (event) => {
    if (document.visibilityState === 'hidden')
        saveDraft();
});

export default useCartStore;
