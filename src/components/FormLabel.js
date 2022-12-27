import { classNames } from "../utils";

export default function FormLabel({ id, children, className, ...rest }) {
    return <label
        htmlFor={id}
        className={classNames("block text-sm font-medium text-gray-700", className)}
        {...rest}
    >
        {children}
    </label>;
}
