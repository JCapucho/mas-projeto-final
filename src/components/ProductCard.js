import { ShoppingCartIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

import useAuthStore from "../store/auth";
import useCartStore from "../store/cart";
import useProductStore from "../store/products";

import GenericCard from "./GenericCard";

export default function ProductCard({ product, edit }) {
    const isStaff = useAuthStore(state => state.user?.staff === true);
    const deleteProduct = useProductStore(state => state.actions.deleteProduct);
    const cartActions = useCartStore(state => state.cartActions());

    function addToCart() {
        cartActions.addProduct(product.id);
    }

    return <GenericCard img={product.photo} name={product.name} header={
        isStaff && <div className="flex justify-end gap-2">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded"
                onClick={edit}
            >
                <PencilSquareIcon className="h-6 w-6" />
            </button>
            <button
                className="bg-red-500 hover:bg-blue-700 text-white font-bold p-2 rounded"
                onClick={() => deleteProduct(product.id)}
            >
                <TrashIcon className="h-6 w-6" />
            </button>
        </div>
    }>
        <h5 className="text-gray-900 text-xl text-center font-bold mb-2">{product.price.toFixed(2)}€</h5>
        <button 
            type="button"
            className="px-4 py-2.5 bg-red-500 text-xs leading-tight uppercase rounded shadow-md hover:bg-red-600 hover:shadow-lg focus:bg-red-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out flex items-center justify-between"
            onClick={addToCart}
            data-thook={`product-${product.id}`}
        >
            Add to cart
            <ShoppingCartIcon className="h-6 w-6 ml-3" />
        </button>
    </GenericCard>;
}
