import create from 'zustand'
import { devtools } from 'zustand/middleware'

export function createStore(name, store) {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return create(devtools(store, { name }));
    } else {
        return create(store);
    }
}

