import { createStore } from "./utils";
import { hookAuthChanged } from "../firebase/auth"

import { getUser } from "../managers/UserManager";
import { logout } from "../managers/AuthManager";

const logoutHooks = [];

const useAuthStore = createStore("AuthStore", (set) => ({
    loaded: false,
    user: null,

    setUser: (user) => set(user),

    actions: {
        logout: async () => {
            await Promise.all(logoutHooks.map(hook => 
                 Promise.resolve(hook())
            ));
            logout();

            set({ user: null })
        }
    }
}));

hookAuthChanged(user => {
    if (user !== null)
        getUser(user.uid).then((user) => useAuthStore.setState({ loaded: true, user }));
    else
        useAuthStore.setState({ loaded: true, user })
});

export function addLogoutHook(hook) {
    logoutHooks.push(hook);
}

export default useAuthStore;
