import { useState, useEffect } from 'react';
import { Link, useSubmit, useParams, Navigate } from "react-router-dom";
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { Tab } from '@headlessui/react'
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";

import { getAllLocations } from "../managers/LocationsManager";

import useCartStore from "../store/cart"
import useProductsStore from "../store/products"

import FormInput from "../components/FormInput";
import CartItems from "../components/CartItems";
import RadioInput from "../components/RadioInput";
import PaymentDetails from "../components/PaymentDetails";

import { classNames, LoadingComponent } from "../utils";

function StyledTab({ children }) {
    return <Tab
        className={({ selected }) =>
            classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                    ? 'bg-white shadow'
                    : 'text-slate-700 hover:bg-white/[0.12] hover:text-blue-500'
            )
        }
    >
        {children}
    </Tab>
};

function ShippingInformation({ changed }) {
    const { register, formState: { errors }, control, setValue } = useFormContext();

    const [currentTab, setCurrentTab] = useState("home");
    const [locations, setLocations] = useState([]);

    const [loading, setLoading] = useState(true);

    function tabChange(index) {
        const tabValue = index === 0 ? "home" : "clinic" ;
        setCurrentTab(tabValue);
        changed(tabValue);
        setValue("shipping", tabValue);
    }

    useEffect(() => {
        getAllLocations().then(locations => {
            setLocations(locations);
            setLoading(false);
        });
    }, []);

    const HomeTab = <>
        <FormInput 
            type="text"
            register={() => register("address", { required: currentTab === "home" })}
            className={[
                "mb-3",
                errors.address && "border-red-500"
            ]}
            aria-invalid={errors.address ? "true" : "false"} 
        >
            Address
        </FormInput>

        <div className="grid grid-cols-6 gap-x-6 gap-y-2 mb-5">
            <div className="col-span-6 sm:col-span-3">
                <FormInput
                    type="text"
                    register={() => register("city", { required: currentTab === "home" })}
                    className={errors.city && "border-red-500"}
                    aria-invalid={errors.city ? "true" : "false"} 
                >
                    City
                </FormInput>
            </div>
            <div className="col-span-6 sm:col-span-3">
                <FormInput
                    type="text"
                    register={() => register("zip", { required: currentTab === "home" })}
                    className={errors.zip && "border-red-500"}
                    aria-invalid={errors.zip ? "true" : "false"} 
                >
                    Zip
                </FormInput>
            </div>
        </div>
    </>;

    const ClinicsTab = <LoadingComponent loading={loading}>
        {
            errors.clinic
            && <h1 className="my-3 p-3 border border-red-400 rounded-lg bg-red-200 text-center font-semibold">
                Select a clinic
            </h1>
        }
        <Controller
            rules={{ required: currentTab === "clinic" }}
            control={control}
            name="clinic"
            defaultValue={null}
            render={({ field }) => <RadioInput
                    className="mb-5"
                    label={"Clinic"}
                    selected={field.value}
                    onChange={field.onChange}
                    options={locations}
                    by="id"
                    render={location => ({
                        label: location.name,
                    })}
                />}
        />
    </LoadingComponent>;

    return <div className="mb-5 border-b border-gray-400">
        <Tab.Group manual onChange={tabChange}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                <StyledTab>Receive home</StyledTab>
                <StyledTab>Collect on a clinic</StyledTab>
            </Tab.List>
            <Tab.Panels className="mt-5">
                <Tab.Panel>
                    {HomeTab}
                </Tab.Panel>
                <Tab.Panel>
                    {ClinicsTab}
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    </div>;
}

function RecurringNotice({ cart }) {
    const now = new Date();
    const nextDateStr = cart.nextDate.toLocaleString('pt-PT', {
        month: 'numeric',
        day: 'numeric',
    });

    const numDays = Math.ceil(Math.abs((cart.nextDate - now) / (24 * 3600 * 1000)));
    const numDaysStr = `${numDays} day${numDays > 1 ? "s" : ""}`

    return<div className="shadow-xl bg-indigo-200 m-5 mt-10 p-5">
        <h1 className="text-xl font-semibold pb-2 mb-2 border-b border-gray-400">Recurring</h1>

        <p>You have marked this cart has recurring, this order will be repeated again
        at {nextDateStr} and every {numDaysStr} afterwards, the orders will be
        automatically billed.</p>

        <p className="mt-3">The cart can be cancelled at any time.</p>
    </div>;
}

function CartPane({ fees, cartId }) {
    const [loaded, cart] = useCartStore(state => [
        state.loaded,
        cartId === null
        ? state.currentCart
        : state.carts.find(cart => cart.id === cartId)
    ]);
    const products = useProductsStore(state => state.products);

    const subtotal = Object.entries(cart?.products || {}).reduce((accum, [id, quantity]) => {
        const itemCost = products[id]?.price * quantity;
        return accum + itemCost;
    }, 0);
    const total = fees + subtotal;

    if (loaded && (!cart?.products || Object.keys(cart?.products).length === 0))
        return <Navigate to={"/dashboard"} replace />

    return <div className="h-full w-full bg-indigo-100 p-10">
        <div className="grid grid-cols-2 lg:grid-cols-3">
            <Link
                to={"/dashboard/cart"}
                className="text-gray-500 font-bold py-2 rounded hover:bg-gray-500 hover:text-white"
            >
                <ArrowUturnLeftIcon className="inline h-6 w-6 mx-3" />
                Back to cart
            </Link>
            <h1 className="text-center my-auto text-2xl font-semibold">Checkout</h1>
            <div aria-hidden="true" />
        </div>
        <CartItems controls={false} cart={cart} />

        <div className="border-t border-gray-400 pt-2 m-5">
            <div className="flex justify-between">
                <h2 className="text-lg">Subtotal</h2>
                <h2 className="text-xl font-semibold" data-thook="checkout-subtotal">{subtotal.toFixed(2)}€</h2>
            </div>

            <div className="flex justify-between">
                <h2 className="text-lg">Shipping</h2>
                <h2 className="text-xl font-semibold" data-thook="checkout-fees">{fees === 0 ? "Free" : fees.toFixed(2) + "€"}</h2>
            </div>
        </div>

        <div className="border-t border-gray-400 flex justify-between pt-2 m-5">
            <h2 className="text-xl">Total</h2>
            <h2 className="text-2xl font-semibold" data-thook="checkout-total">{total.toFixed(2)}€</h2>
        </div>

        { cart.recurring && <RecurringNotice cart={cart} /> }
    </div>;
}

export default function Checkout() {
    const submit = useSubmit();
    const { cartId = null } = useParams();
    const formMethods = useForm({
        defaultValues: { shipping: "home" }
    });

    const [fees, setFees] = useState(5);

    function onSubmit(data) {
        const formData = new FormData();

        for (const [key, value] of Object.entries(data))
            formData.append(key, value)

        if(cartId)
            formData.append("cartId", cartId);

        submit(formData, { method: "post", action: "/dashboard/paymentSucess" });
    }

    const loaded = useCartStore(state => state.loaded);

    return <LoadingComponent loading={!loaded}>
        <div className="h-screen grid grid-cols-1 md:grid-cols-2">
            <CartPane fees={fees} cartId={cartId} />
            <FormProvider {...formMethods} >
                <form className="p-10" onSubmit={formMethods.handleSubmit(onSubmit)}>
                    <ShippingInformation changed={method => {
                        if (method === "home") setFees(5)
                        else setFees(0)
                    }} />
                    <PaymentDetails />
                    <button
                        type="submit"
                        className="block w-full max-w-xs mx-auto bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-3 py-3 font-semibold disabled:bg-gray-700"
                    >
                        Pay
                    </button>
                </form>
            </FormProvider>
        </div>
    </LoadingComponent>;
}
