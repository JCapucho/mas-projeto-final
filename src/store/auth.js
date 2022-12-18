import create from 'zustand'
import { hookAuthChanged } from "../firebase/auth"

import { getUser } from "../managers/UserManager";

const useAuthStore = create((set) => ({
    loaded: false,
    user: null,
    setUser: (user) => set(user)
}))

hookAuthChanged(user => {
    if (user !== null) {
        getUser(user.uid).then((user) => useAuthStore.setState({ loaded: true, user }));
    } else {
        useAuthStore.setState({ loaded: true, user })
    }
})

export default useAuthStore;
