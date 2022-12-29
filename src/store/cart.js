import { createStore } from "./utils";

import { getUserCarts, getUserCartDraft, saveUserCartDraft, storeDraftCart } from "../managers/CartManager";

import useAuthStore, { addLogoutHook } from "./auth";

function createWriteBackController(callback, debounce = 500) {
    let writeBackTimeoutId = null;

    function change() {
        clearTimeout(writeBackTimeoutId);
        writeBackTimeoutId = setTimeout(callback, debounce);
    }

    return { change };
}

const writeback = createWriteBackController(saveDraft);

const useCartStore = createStore("CartsStore", (set, get) => ({
    loaded: false,
    dirty: false,
    currentCart: {},
    carts: [],

    productsInCart: (cart) =>
        Object.values(cart.products || {}).reduce((accum, value) => accum + value, 0),

    actions: {
        addProduct: (product) => set(state => {
            const cartProducts = { ...state.currentCart.products };

            if(!cartProducts[product])
                cartProducts[product] = 0;

            cartProducts[product] += 1;

            writeback.change();

            return {
                dirty: true,
                currentCart: { ...state.currentCart, products: cartProducts }
            };
        }),
        removeProduct: (product) => set(state => {
            const cartProducts = { ...state.currentCart.products };

            delete cartProducts[product];

            writeback.change();

            return {
                dirty: true,
                currentCart: { ...state.currentCart, products: cartProducts }
            };
        }),
        changeQuantity: (product, quantity) => set(state => {
            const cartProducts = { ...state.currentCart.products };

            cartProducts[product] = quantity;

            writeback.change();

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

            set({ loaded: true, dirty: false, currentCart: draft, carts });
        },
        removeAll: () => set({ 
            loaded: false,
            dirty: false,
            currentCart: {},
            carts: []
        }),
        saveDraft: async (user) => {
            const state = get();

            if (!state.dirty) return;

            await saveUserCartDraft(user.id, state.currentCart);
            set({ dirty: false })
        },
        storeDraft: async (userId) => {
            const state = get();

            if (state.dirty)
                await saveUserCartDraft(userId, state.currentCart);

            const cart = await storeDraftCart(userId);

            set(state => ({
                dirty: false,
                currentCart: {},
                carts: [...state.carts, cart]
            }));
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
