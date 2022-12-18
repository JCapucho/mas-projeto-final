import { useId } from "react"

import FormLabel from "./FormLabel";

const classes = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";

export default function FormInput({ children, changed, ...rest }) {
    const id = useId();

    return <div className="w-full">
        <FormLabel id={id}>{children}</FormLabel>
        <input
            id={id}
            className={classes}
            onChange={(event) => changed(event.target.value)}
            {...rest}
        />
    </div>;
}

export function FormTextarea({ children, changed, ...rest }) {
    const id = useId();

    return <div className="w-full">
        <FormLabel id={id}>{children}</FormLabel>
        <textarea
            id={id}
            rows={1}
            className={classes}
            onChange={(event) => changed(event.target.value)}
            {...rest}
        />
    </div>;
}

export function FormCheckbox({ children, changed, ...rest }) {
    const id = useId();

    return <div className="w-full my-3 flex items-end">
        <input 
            id={id}
            type="checkbox"
            className="appearance-none h-5 w-5 border border-gray-300 rounded-md bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" 
            onChange={(event) => changed(event.target.value)}
            {...rest}
        />
        <FormLabel id={id}>{children}</FormLabel>
    </div>;
}
