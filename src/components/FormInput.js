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
