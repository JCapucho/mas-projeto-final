import { useState } from 'react';
import { Dialog } from '@headlessui/react'

import { addSection } from "../managers/ProductsManager";

import FileInput from "./FileInput";

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
        <Dialog open={open} onClose={onClose}>
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                    >
                        Add Section
                    </Dialog.Title>

                    <form onSubmit={submit} className="mt-5 flex items-center flex-col gap-1">
                        <div className="w-full">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Section Name
                            </label>
                            <textarea
                                id="name"
                                type="text"
                                placeholder="Product name"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                rows="1"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Image
                            </label>
                            <FileInput id="image" handleFileSelected={handleFileSelected} required />
                        </div>
                        <button
                            className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            type="submit"
                        >
                            Add Section
                        </button>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
