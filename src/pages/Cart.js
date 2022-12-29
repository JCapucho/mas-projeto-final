import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';

import useCartStore from "../store/cart"
import useProductsStore from "../store/products"

import { LoadingComponent } from "../utils"
import { CounterInput } from "../components/FormInput"
import GenericButton from "../components/GenericButton"

function CartItem({ product }) {
    const [quantity, actions] = useCartStore(state => [
        state.currentCart.products[product.id],
        state.actions
    ]);

    return <div className="w-full flex rounded-md shadow-lg bg-white px-6 py-4 mt-5 gap-5 items-center">
        <img 
            className="rounded-t-lg"
            style={{ maxHeight: "100px", maxWidth: "100px" }}
            src={product.photo}
            alt={product.name} />
        <p className="text-xl">{product.name}</p>
        <div className="flex-grow" aria-hidden="true"></div>
        <div className="self-stretch flex flex-col justify-around">
            <CounterInput
                value={quantity}
                changed={(value) => actions.changeQuantity(product.id, value)}
                min={1} />
            <h5 className="text-gray-900 text-lg text-center">{(product.price * quantity).toFixed(2)}€</h5>
        </div>

        <button
            className="bg-red-500 hover:bg-blue-700 text-white font-bold px-3 rounded self-stretch"
            onClick={() => actions.removeProduct(product.id)}
        >
            <TrashIcon className="h-6 w-6 text-white" />
        </button>
    </div>
}


function CurrentCart() {
    const currentCart = useCartStore(state => state.currentCart);
    const [products, actions] = useProductsStore(
        state => [state.products, state.actions]
    );

    useEffect(() => {
        const ids = Object.keys(currentCart.products || {});
        actions.loadProducts(ids);
    }, [currentCart.products]);

    let ProductsList = <>
        <h1 className="text-center">You don't have any products</h1>
    </>

    if (currentCart.products !== undefined && Object.keys(currentCart.products).length !== 0)
        ProductsList = Object.entries(currentCart.products).map(([id, quantity], i) =>
            products[id] && <CartItem key={i} product={products[id]} />
        );

    return ProductsList;
}

export default function Cart() {
    return <div className="p-5 mx-auto max-w-7xl">
        <CurrentCart />
    </div>
}
