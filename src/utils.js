export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function LoadingComponent({ children, loading }) {
    if (loading) {
        return <h1>Loading</h1>;
    } else {
        return children;
    }
}
