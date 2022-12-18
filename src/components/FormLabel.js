export default function FormLabel({ id, children }) {
    return <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {children}
    </label>;
}
