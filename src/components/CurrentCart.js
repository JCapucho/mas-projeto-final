import { Link } from "react-router-dom";

import useCartStore from "../store/cart"

import CartItems from "./CartItems"

export default function CurrentCart({ controls = true }) {
    const currentCart = useCartStore(state => state.currentCart);

    if (currentCart.products !== undefined && Object.keys(currentCart.products).length !== 0) {
        return <div>
            <CartItems />
            <div className="flex justify-center mt-4">
                <Link
                    to={"/checkout"}
                    className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
                >
                    Move to checkout
                </Link>
            </div>
        </div>
    } else {
        return <div>
            <h1 className="text-lg text-center">You don't have any products</h1>
            <div className="flex justify-center mt-4">
                <Link
                    to={"../products"}
                    className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
                >
                    Browse products
                </Link>
            </div>
        </div>;
    }
}
