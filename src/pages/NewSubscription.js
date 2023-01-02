import { useState } from 'react';
import { useSubmit } from "react-router-dom";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import Datepicker from "react-tailwindcss-datepicker";

import useAuthStore from "../store/auth";
import useAnimalsStore from "../store/animals";

import FormInput from "../components/FormInput";
import FormLabel from "../components/FormLabel";
import RadioInput from "../components/RadioInput";
import PaymentDetails from "../components/PaymentDetails";

import "./NewSubscription.css";

const plans = [
    { name: "Basic", price: 9 },
    { name: "Advanced", price: 15 },
    { name: "Best Friend", price: 19 },
];

function AnimalInfo() {
    const { register, formState: { errors }, control } = useFormContext();

    return <div className="mb-5 border-b border-gray-400">
        <FormInput 
            type="text"
            register={() => register("name", { required: true })}
            margin="mb-3"
            border={errors.name ? "border-red-500" : undefined}
            aria-invalid={errors.name ? "true" : "false"} 
        >
            Name
        </FormInput>

        <div className="grid grid-cols-6 gap-x-6 gap-y-2 mb-3">
            <div className="col-span-6 sm:col-span-3">
                <FormInput
                    type="tel"
                    register={() => register("height", { required: true, valueAsNumber: true })}
                    border={errors.height ? "border-red-500" : undefined}
                    aria-invalid={errors.height ? "true" : "false"} 
                    onKeyPress={(e) => {
                        const good = (e.key >= '0' && e.key <= '9') || e.key === '.';
                        if (!good) e.preventDefault();
                    }}
                >
                    Height (cm)
                </FormInput>
            </div>
            <div className="col-span-6 sm:col-span-3">
                <FormInput
                    type="tel"
                    register={() => register("weight", { required: true, valueAsNumber: true })}
                    border={errors.weight ? "border-red-500" : undefined}
                    aria-invalid={errors.weight ? "true" : "false"} 
                    onKeyPress={(e) => {
                        const good = (e.key >= '0' && e.key <= '9') || e.key === '.';
                        if (!good) e.preventDefault();
                    }}
                >
                    Weight (kg)
                </FormInput>
            </div>
        </div>

        <div className="mb-5">
            <FormLabel>Born</FormLabel>
            <Controller
                rules={{ required: true }}
                control={control}
                name="born"
                render={({ field }) => <Datepicker
                    inputClassName={errors.born && "date-picker-error"}
                    value={{ startDate: field.value, endDate: field.value }}
                    onChange={newValue => field.onChange(new Date(newValue.startDate))}
                    asSingle={true}
                    useRange={false}
                    displayFormat={"DD/MM/YYYY"}
                />}
            />
        </div>
    </div>;
}

export default function NewSubscription() {
    const user = useAuthStore(state => state.user);
    const actions = useAnimalsStore(state => state.actions);
    const submit = useSubmit();
    const formMethods = useForm();

    const [selected, setSelected] = useState(plans[0]);

    async function onSubmit(data) {
        await actions.newAnimal(user, {
            name: data.name,
            height: data.height,
            weight: data.weight,
            born: data.born
        });

        submit(null, { method: "post", action: "/dashboard/SubscriptionSuccessful" });
    }

    return <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <FormProvider {...formMethods} >
            <form className="p-10" onSubmit={formMethods.handleSubmit(onSubmit)}>
                <h1 className="text-center my-auto text-2xl mb-5 font-semibold">New subscription</h1>
                <div className="mb-5 border-b border-gray-400">
                    <RadioInput
                        className="mb-5"
                        label={"Plan"}
                        selected={selected}
                        onChange={setSelected}
                        options={plans}
                        by="name"
                        render={plan => ({
                            label: plan.name,
                            description: `${plan.price.toFixed(2)}€`
                        })}
                    />
                </div>
                <h1 className="text-center my-auto text-xl mb-5 font-semibold">Animal info</h1>
                <AnimalInfo />
                <h1 className="text-center my-auto text-xl mb-5 font-semibold">Payment info</h1>
                <PaymentDetails />
                <button
                    type="submit"
                    className="block w-full max-w-xs mx-auto bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-3 py-3 font-semibold disabled:bg-gray-700"
                >
                    Subscribe
                </button>
            </form>
        </FormProvider>
    </div>;
}
