import { useId } from "react"

import { classNames } from "../utils";
import FormLabel from "./FormLabel";

const classes = `mt-1 block w-full
    rounded-md border-gray-300 shadow-sm
    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`;

export default function FormInput({ children, changed, className, ...rest }) {
    const id = useId();

    return <div className="w-full">
        <FormLabel id={id}>{children}</FormLabel>
        <input
            id={id}
            className={classNames(classes, className)}
            onChange={(event) => changed(event.target.value)}
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

    return <div className="w-full my-3 flex items-end">
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
