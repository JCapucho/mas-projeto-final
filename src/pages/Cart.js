import { useEffect } from "react";
import { useNavigate, useParams, Link, Navigate } from "react-router-dom";
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

import useCartStore from "../store/cart";
import useProductsStore from "../store/products";

import CurrentCart from "../components/CurrentCart";
import GenericCard from "../components/GenericCard";

import { LoadingComponent } from "../utils";

function CartCard({ cart }) {
    const navigate = useNavigate();
    const [products, actions] = useProductsStore(
        state => [state.products, state.actions]
    );

    useEffect(() => {
        const ids = Object.keys(cart.products);
        actions.loadProducts(ids);
    }, [cart.products, actions]);

    const firstProduct = products[Object.keys(cart.products)[0]];
    const total = Object.entries(cart.products).reduce((accum, [id, quantity]) => {
        const itemCost = products[id]?.price * quantity;
        return accum + itemCost;
    }, 0);

    const date = cart.lastDate.toLocaleString('pt-PT', {
        month: 'numeric',
        day: 'numeric',
    });

    return <GenericCard
        img={firstProduct?.photo}
        name={`Bought ${date}`}
        imgWidth="100px"
        imgHeight="100px"
        width="w-52"
        className="cursor-pointer transition-all hover:scale-110"
        onClick={() => navigate(cart.id)}
    >
        <h5 className="text-gray-900 text-xl text-center font-bold mb-2">{total.toFixed(2)}€</h5>
    </GenericCard>;
}

function CartControls({ cartId, carts }) {
    const cart = carts.find(cart => cart.id === cartId);

    if (!cart)
        return <Navigate to={".."} relative="path" replace />

    return <div className="grid grid-cols-2 lg:grid-cols-3">
        <div>
            <Link
                to={".."}
                className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
                relative="path"
            >
                <ArrowUturnLeftIcon className="inline h-6 w-6 mr-3" />
                <span>Return to current cart</span>
            </Link>
        </div>
        <h1 className="text-center my-auto text-2xl font-semibold">
            Bought {cart.lastDate.toLocaleString('pt-PT', {
                month: 'numeric',
                day: 'numeric',
            })}
        </h1>
        <div aria-hidden="true" />
    </div>;
}

export default function Cart() {
    const [carts, loaded] = useCartStore(state => [state.carts, state.loaded]);
    const { cartId } = useParams();

    return <LoadingComponent loading={!loaded}>
        <div className="p-5 mx-auto max-w-7xl">
            {cartId && <CartControls carts={carts} cartId={cartId} />}

            <CurrentCart id={cartId} />

            {!cartId && <>
                <h1 className="text-center text-3xl font-semibold border-t border-gray-400 p-5 mt-10">Stored carts</h1>
                <div className="flex gap-5 overflow-x-auto p-5">
                    {carts.map((cart, i) => <CartCard key={i} cart={cart} />)}
                </div>
            </>}
        </div>
    </LoadingComponent>;
}
