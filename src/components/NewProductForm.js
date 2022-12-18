import { useState } from 'react';
import { Combobox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';

import { addProduct } from "../managers/ProductsManager";

import GenericDialog from "./GenericDialog";
import GenericButton from "./GenericButton";
import FileInput from "./FileInput";
import FormLabel from "./FormLabel";
import FormInput, { FormTextarea } from "./FormInput";

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
        <GenericDialog open={open} onClose={onClose} title={"Add Product"}>
            <form onSubmit={submit} className="mt-5 flex items-center flex-col gap-3">
                <FormTextarea 
                    type="text"
                    placeholder="Product name"
                    value={name}
                    required
                    changed={setName}
                >
                    Product Name
                </FormTextarea>
                <div className="w-full">
                    <FormLabel id="section">Section</FormLabel>
                    {
                        hasSections ?
                            <SectionPicker sections={sections} value={section} onChange={setSection} /> :
                            <h1>No sections</h1>
                    }
                </div>
                <FormInput
                    id="price"
                    type="number"
                    placeholder="Price"
                    value={price}
                    required
                    changed={setPrice}
                >
                    Price
                </FormInput>
                <div className="w-full">
                    <FormLabel id="image">Image</FormLabel>
                    <FileInput id="image" handleFileSelected={handleFileSelected} required />
                </div>
                <GenericButton type="submit" disabled={!hasSections}>
                    Add Product
                </GenericButton>
            </form>
        </GenericDialog>
    );
}
