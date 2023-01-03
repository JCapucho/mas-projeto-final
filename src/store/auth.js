import { createStore } from "./utils";
import { hookAuthChanged } from "../firebase/auth"

import { getUser as getUserData } from "../managers/UserManager";
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
            await logout();

            set({ user: null })
        }
    }
}));

hookAuthChanged(async firebaseUser => {
    if (firebaseUser !== null) {
        try {
            const user = await getUserData(firebaseUser.uid);
            useAuthStore.setState({ loaded: true, user });
        } catch(e) {
            useAuthStore.setState({ loaded: true, user: null })
        }
    } else {
        useAuthStore.setState({ loaded: true, user: null })
    }
});

export function addLogoutHook(hook) {
    logoutHooks.push(hook);
}

export async function getUser() {
    return new Promise(resolve => {
        const state = useAuthStore.getState();
        if (state.loaded)
            return resolve(state.user);

        let unsub;
        unsub = useAuthStore.subscribe(state => {
            if(state.loaded) {
                unsub();
                resolve(state.user);
            }
        });
    });
}

export default useAuthStore;
