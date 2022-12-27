import { classNames } from "../utils";

export default function FormLabel({ children, className, ...rest }) {
    const defaultClasses = "mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700 ";
    return <button
        className={classNames(defaultClasses, className)}
        {...rest}
    >
        {children}
    </button>
}
