export default function FormLabel({ children, className, ...rest }) {
    return <button
        className={"mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700 " + className}
        {...rest}
    >
        {children}
    </button>
}
