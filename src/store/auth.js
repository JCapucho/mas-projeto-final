import create from 'zustand'
import { hookAuthChanged } from "../firebase/auth"

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/base";

const useAuthStore = create((set) => ({
    loaded: false,
    user: null,
    setUser: (user) => set(user)
}))

hookAuthChanged(user => {
    async function getUser(firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        return userSnap.data();
    }

    if (user !== null) {
        getUser(user).then((user) => useAuthStore.setState({ loaded: true, user }));
    } else {
        useAuthStore.setState({ loaded: true, user })
    }
})

export default useAuthStore;
