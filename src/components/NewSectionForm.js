import { useState, useEffect } from 'react';

import useSectionsStore from "../store/sections";

import GenericDialog from "./GenericDialog";
import GenericButton from "./GenericButton";
import FileInput from "./FileInput";
import FormLabel from "./FormLabel";
import { FormTextarea } from "./FormInput";

export default function NewSectionForm({ section = null, open, onClose }) {
    const actions = useSectionsStore(state => state.actions);
    const [image, setImage] = useState(null);
    const [name, setName] = useState(section?.name || "");

    useEffect(() => {
        setName(section?.name || "");
    }, [section]);

    const newForm = section === null;
    const title = newForm ? "Add Section" : "Edit Section";

    const handleFileSelected = (e) => {
        setImage(e.target.files[0])
    }

    async function submit(event) {
        event.preventDefault();


        if (newForm) {
            await actions.addSection({ name }, image);
        } else {
            const updatedData = {};

            if(name !== section.name) updatedData.name = name;

            await actions.editSection(section.id, updatedData, image);
        }

        onClose();
    }

    return (
        <GenericDialog open={open} onClose={onClose} title={title}>
            <form onSubmit={submit} className="mt-5 flex items-center flex-col gap-1">
                <FormTextarea 
                    type="text"
                    placeholder="Section name"
                    value={name}
                    changed={setName}
                    required={newForm}
                >
                    Section Name
                </FormTextarea>
                <div className="w-full">
                    <FormLabel id="image">Image</FormLabel>
                    <FileInput id="image" handleFileSelected={handleFileSelected} required={newForm} />
                </div>
                <GenericButton type="submit">
                    {title}
                </GenericButton>
            </form>
        </GenericDialog>
    );
}
