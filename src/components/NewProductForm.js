import { useState } from 'react';
import { Combobox, Dialog } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';

import { addProduct } from "../managers/ProductsManager";

import FileInput from "./FileInput";

function SectionPicker({ sections, value, onChange }) {
    const [query, setQuery] = useState('');

    const filteredSections =
        query === ''
            ? sections
            : sections.filter((section) =>
                section.name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            );

    return <Combobox value={value} onChange={onChange}>
        <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-md text-left border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 sm:text-sm">
                <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(section) => section?.name}
                    required
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                </Combobox.Button>
            </div>
            <Combobox.Options
                className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
                {filteredSections.map((section, i) => (
                    <Combobox.Option
                        key={i}
                        value={section}
                        className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                            }`
                        }
                    >
                        {({ selected, active }) => (
                            <>
                                <span
                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                        }`}
                                >
                                    {section.name}
                                </span>
                                {selected ? (
                                    <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-indigo-600'
                                            }`}
                                    >
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                ) : null}
                            </>
                        )}
                    </Combobox.Option>
                ))}
            </Combobox.Options>
        </div>
    </Combobox>;
}

export default function NewProductForm({ sections, added, open, onClose }) {
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [section, setSection] = useState(null);
    const [price, setPrice] = useState(0);

    const hasSections = sections !== 0;

    const handleFileSelected = (e) => {
        setImage(e.target.files[0])
    }

    async function submit(event) {
        event.preventDefault();
        const priceFloat = parseFloat(price);

        const addedProduct = await addProduct({
            name,
            price: priceFloat,
            sectionId: section.id
        }, image);

        added(addedProduct);
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
                        Add Product
                    </Dialog.Title>

                    <form onSubmit={submit} className="mt-5 flex items-center flex-col gap-3">
                        <div className="w-full">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Product Name
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
                            <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                                Section
                            </label>
                            {
                                hasSections ?
                                    <SectionPicker sections={sections} value={section} onChange={setSection} /> :
                                    <h1>No sections</h1>
                            }
                        </div>
                        <div className="w-full">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Price
                            </label>
                            <input
                                id="price"
                                type="number"
                                placeholder="Price"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={price}
                                onChange={(event) => setPrice(event.target.value)}
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
                            className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
                            type="submit"
                            disabled={!hasSections}
                        >
                            Add Product
                        </button>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
