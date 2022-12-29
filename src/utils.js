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

export function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}
