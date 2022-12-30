import { useId } from "react"

import { classNames } from "../utils";
import FormLabel from "./FormLabel";

const classes = `mt-1 block w-full
    rounded-md border-gray-300 shadow-sm
    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`;

export default function FormInput({ children, changed, className, register, ...rest }) {
    const id = useId();

    const methods = register ? register() : {};
    return <div className="w-full">
        <FormLabel id={id}>{children}</FormLabel>
        <input
            id={id}
            className={classNames(classes, className)}
            onChange={(event) => changed(event.target.value)}
            {...methods}
            {...rest}
        />
    </div>;
}

export function FormTextarea({ children, changed, className, ...rest }) {
    const id = useId();

    return <div className="w-full">
        <FormLabel id={id}>{children}</FormLabel>
        <textarea
            id={id}
            rows={1}
            className={classNames(classes, className)}
            onChange={(event) => changed(event.target.value)}
            {...rest}
        />
    </div>;
}

export function FormCheckbox({ children, changed, className, ...rest }) {
    const id = useId();
    const defaultClasses = `appearance-none h-5 w-5
        border border-gray-300 rounded-md
        checked:bg-blue-600 checked:border-blue-600
        focus:outline-none transition duration-200
        mr-2 cursor-pointer`;

    return <div className="w-full my-3 flex items-center">
        <input 
            id={id}
            type="checkbox"
            className={classNames(defaultClasses, className)}
            onChange={(event) => changed(event.target.checked)}
            {...rest}
        />
        <FormLabel id={id}>{children}</FormLabel>
    </div>;
}

export function CounterInput({changed, value, min, max, ...rest}) {
    function onChange(value) {
        if (min !== undefined)
            value = Math.max(min, value);

        if (max !== undefined)
            value = Math.min(max, value);

        changed(value);
    }

    return <div className="h-10 w-32">
        <div className="flex w-full h-10 rounded border border-gray-300 shadow-sm focus-within:border-indigo-500">
            <button
                className="h-full w-20 border-r hover:bg-gray-300 disabled:bg-gray-300 disabled:text-gray-400"
                onClick={() => onChange(value - 1)}
                disabled={min !== undefined && value <= min}
            >
                <span className="m-auto text-2xl font-thin">−</span>
            </button>
            <input 
                type="number"
                className="w-full text-center border-0 sm:text-sm appearance-none focus:ring-0 focus:ring-offset-0"
                style={{ MozAppearance: "textfield" }}
                onChange={(event) => onChange(event.target.value)}
                value={value}
                min={min}
                max={max}
                {...rest}
            />
            <button
                className="h-full w-20 border-l hover:bg-gray-300 disabled:bg-gray-300 disabled:text-gray-400"
                onClick={() => onChange(value + 1)}
                disabled={max !== undefined && value >= max}
            >
                <span className="m-auto text-2xl font-thin">+</span>
            </button>
        </div>
    </div>;
}
