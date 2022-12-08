import create from 'zustand'
import { hookAuthChanged } from "../firebase/auth"

const useAuthStore = create((set) => ({
    loaded: false,
    user: null,
    setUser: (user) => set(user)
}))

hookAuthChanged((user) => {
    console.log(user);
    useAuthStore.setState({ loaded: true, user })
})

export default useAuthStore;
