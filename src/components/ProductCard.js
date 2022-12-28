import { ShoppingCartIcon } from '@heroicons/react/24/solid';

import useCartStore from "../store/cart";

import GenericCard from "./GenericCard";

export default function ProductCard({ product, children }) {
    const cartActions = useCartStore(state => state.actions);

    function addToCart() {
        cartActions.addProduct(product.id);
    }

    return <GenericCard img={product.photo} name={product.name} header={children}>
        <h5 className="text-gray-900 text-xl text-center font-bold mb-2">{product.price.toFixed(2)}€</h5>
        <button 
            type="button"
            className="px-4 py-2.5 bg-red-500 text-xs leading-tight uppercase rounded shadow-md hover:bg-red-600 hover:shadow-lg focus:bg-red-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out flex items-center justify-between"
            onClick={addToCart}
        >
            Add to cart
            <ShoppingCartIcon className="h-6 w-6 ml-3" />
        </button>
    </GenericCard>;
}
