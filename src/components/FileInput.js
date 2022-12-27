import { classNames } from "../utils";

export default function FileInput({ id, handleFileSelected, className, ...rest }) {
    const defaultClasses = `border-gray-300 border rounded-md w-full
        file:mr-5 file:py-2 file:px-6
        file:rounded-l-md file:border-0
        file:text-sm file:font-medium
        file:bg-gray-700 file:text-white
        hover:file:cursor-pointer hover:file:bg-gray-900
        focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`

    return (
        <input
            id={id}
            className={classNames(defaultClasses, className)}
            type="file"
            onChange={handleFileSelected}
            {...rest} />
    );
}
