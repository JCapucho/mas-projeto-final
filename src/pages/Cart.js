import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

import useCartStore from "../store/cart";
import useProductsStore from "../store/products";

import CurrentCart from "../components/CurrentCart";
import GenericCard from "../components/GenericCard";

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

export default function Cart() {
    const carts = useCartStore(state => state.carts);
    const { cartId } = useParams();

    return <div className="p-5 mx-auto max-w-7xl">
        {cartId && <div className="flex m-5">
            <Link
                to={".."}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700 flex items-center justify-between"
                relative="path"
            >
                <ArrowUturnLeftIcon className="h-6 w-6 mr-3" />
                Return to current cart
            </Link>
        </div>}

        <CurrentCart id={cartId} />

        {!cartId && <>
            <h1 className="text-center text-3xl font-semibold border-t border-gray-400 p-5 mt-10">Stored carts</h1>
            <div className="flex gap-5 overflow-x-auto p-5">
                {carts.map((cart, i) => <CartCard key={i} cart={cart} />)}
            </div>
        </>}
    </div>
}
