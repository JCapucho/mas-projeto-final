import { useState } from 'react';

import { addSection } from "../managers/ProductsManager";

import GenericDialog from "./GenericDialog";
import GenericButton from "./GenericButton";
import FileInput from "./FileInput";
import FormLabel from "./FormLabel";
import { FormTextarea } from "./FormInput";

export default function NewSectionForm({ added, open, onClose }) {
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");

    const handleFileSelected = (e) => {
        setImage(e.target.files[0])
    }

    async function submit(event) {
        event.preventDefault();

        const addedSection = await addSection({ name }, image);

        added(addedSection);
        onClose();
    }

    return (
        <GenericDialog open={open} onClose={onClose} title={"Add Section"}>
            <form onSubmit={submit} className="mt-5 flex items-center flex-col gap-1">
                <FormTextarea 
                    type="text"
                    placeholder="Section name"
                    value={name}
                    changed={setName}
                    required
                >
                    Section Name
                </FormTextarea>
                <div className="w-full">
                    <FormLabel id="image">Image</FormLabel>
                    <FileInput id="image" handleFileSelected={handleFileSelected} required />
                </div>
                <GenericButton type="submit">
                    Add Section
                </GenericButton>
            </form>
        </GenericDialog>
    );
}
