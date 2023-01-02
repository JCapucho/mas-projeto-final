import { createStore } from "./utils";

import { newAnimal, getUserAnimals } from "../managers/AnimalsManager";

import useAuthStore, { addLogoutHook } from "./auth";

const useAnimalsStore = createStore("AnimalsStore", (set, get) => ({
    loaded: false,
    animals: [],

    actions: {
        loadUserAnimals: async (userId) => {
            const animals = await getUserAnimals(userId);

            set({ loaded: true, animals });
        },
        removeAll: () => set({ loaded: false, animals: [] }),
        newAnimal: async (user, data) => {
            const animal = await newAnimal(user.id, data);

            set(state => ({
                animals: [...state.animals, animal]
            }));
        },
    },
}));

addLogoutHook(async () => {
    useAnimalsStore.getState().actions.removeAll();
});

useAuthStore.subscribe(state => {
    if (state.user !== null)
        useAnimalsStore.getState().actions.loadUserAnimals(state.user.id);
});

export default useAnimalsStore;
