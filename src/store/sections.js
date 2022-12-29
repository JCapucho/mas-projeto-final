import { createStore } from "./utils";

import {
    addSection,
    getAllSections,
    deleteSection,
    editSection
} from "../managers/ProductsManager";

import { addLogoutHook } from "./auth";

const useSectionsStore = createStore("ProductsStore", (set, get) => ({
    loaded: false,
    sections: [],

    actions: {
        loadSections: async () => {
            if (get().loaded) return;

            const sections = await getAllSections();

            set(state => ({ loaded: true, sections }));
        },
        removeAll: () => set({ loaded: false, sections: [] }),

        addSection: async (newSection, image) => {
            const addedSection = await addSection(newSection, image);

            set(state => {
                return { sections: [...state.sections, addedSection] };
            });
        },
        editSection: async (id, changes, image) => {
            const editedSection = await editSection(id, changes, image);

            set(state => {
                const sections = [...state.sections];

                const i = sections.findIndex(section => section.id === editedSection.id);
                sections[i] = editedSection;

                return { sections };
            });
        },
        deleteSection: async (id) => {
            await deleteSection(id);

            set(state => {
                return { sections: state.sections.filter(section => section.id !== id) };
            });
        }
    },
}));

addLogoutHook(() => {
    useSectionsStore.getState().actions.removeAll();
});

export default useSectionsStore;
