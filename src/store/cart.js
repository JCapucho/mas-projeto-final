import { createStore } from "./utils";

import {
    getUserCarts,
    getUserCartDraft,
    saveUserCartDraft,
    storeDraftCart,
    updateCart
} from "../managers/CartManager";

import useAuthStore, { addLogoutHook } from "./auth";

function createWriteBackController(callback, debounce = 500) {
    let writeBackTimeoutId = null;

    function change() {
        clearTimeout(writeBackTimeoutId);
        writeBackTimeoutId = setTimeout(callback, debounce);
    }

    return { change };
}

const writeback = createWriteBackController(saveCarts);

const useCartStore = createStore("CartsStore", (set, get) => ({
    loaded: false,

    currentCart: {},
    carts: [],

    draftDirty: false,
    cartsDirty: {},

    productsInCart: (cart) =>
        Object.values(cart.products || {}).reduce((accum, value) => accum + value, 0),

    actions: {
        loadUserCarts: async (userId) => {
            const [carts, draft] = await Promise.all([
                getUserCarts(userId),
                getUserCartDraft(userId),
            ]);

            set({ 
                loaded: true,
                currentCart: draft,
                carts,
                draftDirty: false,
                cartsDirty: {}
            });
        },
        removeAll: () => set({ 
            loaded: false,
            draftDirty: false,
            currentCart: {},
            carts: [],
            draftDirty: false,
            cartsDirty: {}
        }),
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

    cartActions: (cartId) => {
        const getCart = (state) => {
            const cartIndex = cartId ? state.carts.findIndex(cart => cart.id === cartId) : -1;
            const cart = cartIndex < 0 ? state.currentCart : state.carts[cartIndex];

            return { cart, cartIndex };
        };
        const cartChangesAdapter = (mutator) => set(state => {
            const { cart, cartIndex } = getCart(state);
            const changes = {};
            const cartData = mutator(cart);

            if (cartIndex < 0) {
                changes["currentCart"] = cartData;
                changes.dirty = true;
            } else {
                const newCarts = [...state.carts];
                newCarts[cartIndex] = cartData;
                changes["carts"] = newCarts;

                changes.cartsDirty = {...state.cartsDirty};
                changes.cartsDirty[cart.id] = true;
            }

            writeback.change();

            return changes;
        });

        return {
            addProduct: (product) => cartChangesAdapter(cart => {
                const cartProducts = { ...cart.products };

                if(!cartProducts[product])
                    cartProducts[product] = 0;

                cartProducts[product] += 1;

                return { ...cart, products: cartProducts };
            }),
            removeProduct: (product) => cartChangesAdapter(cart => {
                const cartProducts = { ...cart.products };

                delete cartProducts[product];

                return { ...cart, products: cartProducts };
            }),
            changeQuantity: (product, quantity) => cartChangesAdapter(cart => {
                const cartProducts = { ...cart.products };

                cartProducts[product] = quantity;

                return { ...cart, products: cartProducts };
            }),
            saveCart: async (user) => {
                const state = get();
                const { cart, cartIndex } = getCart(state);

                const dirty = cartIndex < 0 ? state.draftDirty : state.cartsDirty[cart.id];
                if (!dirty) return;

                if (cartIndex < 0) {
                    await saveUserCartDraft(user.id, cart);
                    set({ dirty: false })
                } else {
                    const changes = {
                        recurring: cart.recurring,
                        lastDate: cart.lastDate,
                        products: cart.products,
                    };

                    if (cart.nextDate) cart.nextDate = cart.nextDate;

                    const cartData = await updateCart(cart.id, changes);

                    set(state => {
                        const carts = [...state.carts];
                        const cartsDirty = {...state.cartsDirty};

                        carts[cartIndex] = cartData;
                        delete cartsDirty[cart.id];

                        return { cartsDirty, carts: carts }
                    })
                }
            },
        }
    }
}));

async function saveCarts() {
    const user = useAuthStore.getState().user;
    const { draftDirty, cartsDirty, cartActions } = useCartStore.getState();

    await Promise.all([
        ...(draftDirty ? [cartActions().saveCart(user)] : []),
        ...Object.keys(cartsDirty).map(id => cartActions(id).saveCart(user))
    ])
}

addLogoutHook(async () => {
    await saveCarts();
    useCartStore.getState().actions.removeAll();
});

useAuthStore.subscribe(state => {
    if (state.user !== null)
        useCartStore.getState().actions.loadUserCarts(state.user.id);
});

document.addEventListener('visibilitychange', (event) => {
    if (document.visibilityState === 'hidden')
        saveCarts();
});

export default useCartStore;
