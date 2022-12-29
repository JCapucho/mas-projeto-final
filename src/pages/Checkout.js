import { useState, useEffect } from 'react';
import { Link, useSubmit, Navigate } from "react-router-dom";
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { Tab } from '@headlessui/react'
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";

import { getAllLocations } from "../managers/LocationsManager";

import useCartStore from "../store/cart"
import useProductsStore from "../store/products"

import FormLabel from "../components/FormLabel";
import FormInput from "../components/FormInput";
import CartItems from "../components/CartItems";
import RadioInput from "../components/RadioInput";

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
        >
        </Controller>
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

function PaymentDetails() {
    const { register, formState: { errors } } = useFormContext();

    return <>
        <div className="mb-3">
            <FormLabel>Card information</FormLabel>
            <FormInput
                type="tel"
                placeholder="1234 1234 1234 1234"
                autoComplete="cc-number"
                register={() => register("cardNumber", {
                    required: true,
                    pattern: /[0-9\s]{13,19}/,
                })}
                className={[
                    "rounded-b-none",
                    errors.cardNumber && "border-red-500"
                ]}
                aria-invalid={errors.cardNumber ? "true" : "false"} 
                onKeyPress={(e) => {
                    const good = e.target.value.length < 19
                        && (e.key === ' ' || (e.key >= '0' && e.key <= '9'));
                    if (!good) e.preventDefault();
                }}
                />
            <div className="flex">
                <FormInput
                    type="tel"
                    placeholder="MM/YY"
                    register={() => register("cardExp", { required: true })}
                    className={[
                        "mt-0 rounded-t-none rounded-r-none border-t-0",
                        errors.cardExp && "border-red-500"
                    ]}
                    aria-invalid={errors.cardExp ? "true" : "false"} 
                    onKeyPress={(e) => {
                        const good = e.target.value.length < 7 && e.key >= '0' && e.key <= '9';
                        if (!good) e.preventDefault();
                    }}
                    onKeyUp={(e) => {
                        const isMonthEntered = /^\d\d$/.exec(e.target.value);
                        if (e.key >= '0' && e.key <= '9' && isMonthEntered)
                            e.target.value = e.target.value + " / ";
                    }}
                    onKeyDown={(e) => {
                        const isMonthAndSlashEntered = /^\d\d \/ $/.exec(e.target.value);
                        if (isMonthAndSlashEntered && e.key === 'Backspace')
                            e.target.value = e.target.value.slice(0, -3);
                    }}
                    />
                <FormInput
                    type="tel"
                    placeholder="CVC"
                    register={() => register("cardSec", { required: true })}
                    className={[
                        "mt-0 rounded-t-none rounded-l-none border-t-0 border-l-0",
                        errors.cardSec && "border-red-500"
                    ]}
                    aria-invalid={errors.cardSec ? "true" : "false"} 
                    onKeyPress={(e) => {
                        const good = e.target.value.length < 4 && e.key >= '0' && e.key <= '9';
                        if (!good) e.preventDefault();
                    }}
                    />
            </div>
        </div>
        <div className="mb-3">
            <FormLabel id="name">Name on card</FormLabel>
            <FormInput
                id="name"
                type="text"
                register={() => register("cardName", { required: true })}
                className={errors.cardName && "border-red-500"}
                aria-invalid={errors.cardName ? "true" : "false"} 
                />
        </div>
    </>;
}

export default function Checkout() {
    const submit = useSubmit();
    const formMethods = useForm({
        defaultValues: { shipping: "home" }
    });
    const [loaded, cartProducts] = useCartStore(state => [
        state.loaded,
        state.currentCart.products
    ]);
    const products = useProductsStore(state => state.products);

    const [fees, setFees] = useState(5);

    const subtotal = Object.entries(cartProducts || {}).reduce((accum, [id, quantity]) => {
        const itemCost = products[id]?.price * quantity;
        return accum + itemCost;
    }, 0);
    const total = fees + subtotal;

    function onSubmit(data) {
        const formData = new FormData();

        for (const [key, value] of Object.entries(data))
            formData.append(key, value)

        submit(formData, { method: "post", action: "/dashboard/paymentSucess" });
    }

    if (loaded && (!cartProducts || Object.keys(cartProducts).length === 0))
        return <Navigate to={"/dashboard"} replace />

    return (
        <div className="h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="h-full w-full bg-indigo-100 p-10">
                <div className="grid grid-cols-2 lg:grid-cols-3">
                    <Link
                        to={"/dashboard/cart"}
                        className="hover:bg-gray-500 text-gray-500 font-bold py-2 rounded disabled:bg-gray-700"
                    >
                        <ArrowUturnLeftIcon className="inline h-6 w-6 mx-3" />
                        Back to cart
                    </Link>
                    <h1 className="text-center my-auto text-2xl font-semibold">Checkout</h1>
                    <div aria-hidden="true" />
                </div>
                <CartItems controls={false} />

                <div className="border-t border-gray-400 pt-2 m-5">
                    <div className="flex justify-between">
                        <h2 className="text-lg">Subtotal</h2>
                        <h2 className="text-xl font-semibold">{subtotal.toFixed(2)}€</h2>
                    </div>

                    <div className="flex justify-between">
                        <h2 className="text-lg">Shipping</h2>
                        <h2 className="text-xl font-semibold">{fees === 0 ? "Free" : fees.toFixed(2) + "€"}</h2>
                    </div>
                </div>

                <div className="border-t border-gray-400 flex justify-between pt-2 m-5">
                    <h2 className="text-xl">Total</h2>
                    <h2 className="text-2xl font-semibold">{total.toFixed(2)}€</h2>
                </div>
            </div>
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
    );
}
