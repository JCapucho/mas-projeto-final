import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

import { Link } from "react-router-dom";

import useCartStore from "../store/cart"

import { FormCheckbox } from "./FormInput";
import CartItems from "./CartItems"

function NextDatePicker({ cart, cartActions }) {
    const [banner, setBanner] = useState(null);

    function handleNextDateChanged(newValue) {
        setBanner(null);

        if(newValue.startDate) {
            const nextDate = new Date(newValue.startDate);

            if (nextDate > new Date())
                cartActions.setNextDate(nextDate);
            else
                setBanner("the next delivery date must be in the future")
        }
    }

    return <>
        {banner !== null &&
            <div className="my-5 border border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                {banner}
            </div>
        }
        <Datepicker
            containerClassName={"recurring-date-picker"}
            value={{ startDate: cart.nextDate, endDate: cart.nextDate }}
            onChange={handleNextDateChanged}
            asSingle={true}
            useRange={false}
            displayFormat={"DD/MM/YYYY"}
        />
    </>;
}

export default function CurrentCart({ controls = true, id = null }) {
    const [cart, cartActions] = useCartStore(state => [
        id === null ? state.currentCart : state.carts.find(cart => cart.id === id),
        state.cartActions(id)
    ]);

    if (cart?.products !== undefined && Object.keys(cart.products).length !== 0) {
        return <div>
            <CartItems cart={cart} />
            <div className="flex justify-center mt-4">
                <div className="shadow-lg p-5 flex flex-col justify-center">
                    <FormCheckbox checked={cart.recurring || false} changed={cartActions.toggleRecurring} name="recurring">
                        <span className="text-xl">Recurring</span>
                    </FormCheckbox>
                    {cart.recurring && <NextDatePicker cart={cart} cartActions={cartActions} />}
                    <Link
                        to={"/checkout" + (id !== null ? `/${id}` : "")}
                        className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700 mt-3"
                    >
                        Move to checkout
                    </Link>
                </div>
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
