import create from 'zustand'
import { hookAuthChanged } from "../firebase/auth"

const useAuthStore = create((set) => ({
    loaded: false,
    user: undefined
}))

hookAuthChanged((user) => {
    useAuthStore.setState({ loaded: true, user })
})

export default useAuthStore;
