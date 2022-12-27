import { createStore } from "./utils";
import { hookAuthChanged } from "../firebase/auth"

import { getUser } from "../managers/UserManager";

import useAppointmentsStore from "./appointments";

const useAuthStore = createStore("AuthStore", (set) => ({
    loaded: false,
    user: null,
    setUser: (user) => set(user)
}))

hookAuthChanged(user => {
    if (user !== null) {
        getUser(user.uid).then((user) => useAuthStore.setState({ loaded: true, user }));
    } else {
        useAuthStore.setState({ loaded: true, user })
        useAppointmentsStore.getState().actions.removeAll();
    }
})

export default useAuthStore;
