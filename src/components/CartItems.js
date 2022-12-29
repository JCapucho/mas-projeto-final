import { useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';

import useCartStore from "../store/cart"
import useProductsStore from "../store/products"

import { CounterInput } from "../components/FormInput"

function CartItem({ product, controls }) {
    const [quantity, actions] = useCartStore(state => [
        state.currentCart.products[product.id],
        state.actions
    ]);

    return <div
        className="flex flex-wrap rounded-md shadow-lg bg-white px-6 py-4 mt-5 gap-5"
    >
        <div className="self-stretch flex gap-2 items-center gap-2">
            <img 
                className="rounded-t-lg"
                style={{ maxHeight: "100px", maxWidth: "100px" }}
                src={product.photo}
                alt={product.name} />
            <p className="text-xl">{product.name}</p>
        </div>

        <div className="flex-grow" aria-hidden="true" />

        <div className="mx-auto self-stretch flex gap-2 justify-center">
            <div className="self-stretch flex flex-col justify-around gap-2">
                <CounterInput
                    value={quantity}
                    changed={(value) => actions.changeQuantity(product.id, value)}
                    min={1} />
                <h5 className="text-gray-900 text-lg text-center my-auto">{(product.price * quantity).toFixed(2)}€</h5>
            </div>

            {controls && <button
                className="bg-red-500 hover:bg-blue-700 text-white font-bold px-3 rounded self-stretch"
                onClick={() => actions.removeProduct(product.id)}
            >
                <TrashIcon className="h-6 w-6 text-white" />
            </button>}
        </div>
    </div>
}


export default function CartItems({ controls = true }) {
    const currentCart = useCartStore(state => state.currentCart);
    const [products, actions] = useProductsStore(
        state => [state.products, state.actions]
    );

    useEffect(() => {
        const ids = Object.keys(currentCart.products || {});
        actions.loadProducts(ids);
    }, [currentCart.products, actions]);

    return <div>
        {Object.entries(currentCart.products || {}).map(([id, quantity], i) =>
            products[id] && <CartItem key={i} product={products[id]} controls={controls} />
        )}
    </div>;
}
