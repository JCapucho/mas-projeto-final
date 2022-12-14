import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react'
import { ShoppingCartIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';

import { addSection, getAllSections, addProduct, getAllProducts } from "../managers/ProductsManager";

import useAuthStore from "../store/auth";

function NewSectionForm({ added }) {
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");

    const handleFileSelected = (e) => {
        setImage(e.target.files[0])
    }

    async function submit(event) {
        event.preventDefault();

        const addedSection = await addSection({ name }, image);

        added(addedSection);
    }

    return <div className="flex justify-center">
        <form onSubmit={submit} className="flex items-center flex-col gap-3">
            <h1 className="text-xl font-bold text-center">Add Section</h1>
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
                <input
                    id="image"
                    className="border-gray-300 border rounded-md
                    file:mr-5 file:py-2 file:px-6
                    file:rounded-l-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-gray-700 file:text-white
                    hover:file:cursor-pointer hover:file:bg-gray-900
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    type="file"
                    onChange={handleFileSelected}
                    required />
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit">
                Add Section
            </button>
        </form>
    </div>
}

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

function NewProductForm({ sections, added }) {
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

    return <div className="flex justify-center">
        <form onSubmit={submit} className="flex items-center flex-col gap-3">
            <h1 className="text-xl font-bold text-center">Add product</h1>
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
                <input
                    id="image"
                    className="border-gray-300 border rounded-md
                    file:mr-5 file:py-2 file:px-6
                    file:rounded-l-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-gray-700 file:text-white
                    hover:file:cursor-pointer hover:file:bg-gray-900
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    type="file"
                    onChange={handleFileSelected}
                    required />
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
                type="submit"
                disabled={!hasSections}
            >
                Add Product
            </button>
        </form>
    </div>
}

function ProductCard({ name, photo, price, section, isStaff }) {
    return (
        <div className="rounded-lg shadow-lg bg-white p-6 w-96">
            <img className="rounded-t-lg mx-auto" style={{ maxHeight: "300px", maxWidth: "300px" }} src={photo} alt={name} />
            {isStaff && <p className="text-gray-900 text-lg text-center mb-2">section: {section.id}</p>}
            <p className="text-gray-900 text-lg text-center mb-2 mt-4">{name}</p>
            <h5 className="text-gray-900 text-xl text-center font-bold mb-2">{price.toFixed(2)}€</h5>
            <div className="flex justify-center mt-4">
                <button type="button" className=" px-4 py-2.5 bg-red-500 text-xs leading-tight uppercase rounded shadow-md hover:bg-red-600 hover:shadow-lg focus:bg-red-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out flex items-center justify-between">
                    Add to cart
                    <ShoppingCartIcon className="h-6 w-6 ml-3" />
                </button>
            </div>
        </div>
    );
}

function SectionCard({ name, photo, isStaff }) {
    return (
        <div className="rounded-lg shadow-lg bg-white p-6 w-96">
            <img className="rounded-t-lg mx-auto" style={{ maxHeight: "300px", maxWidth: "300px" }} src={photo} alt={name} />
            <p className="text-gray-900 text-lg text-center mb-2 mt-4">{name}</p>
            <div className="flex justify-center mt-4">
                <button type="button" className=" px-4 py-2.5 bg-red-500 text-xs leading-tight uppercase rounded shadow-md hover:bg-red-600 hover:shadow-lg focus:bg-red-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out">
                    View section
                </button>
            </div>
        </div>
    );
}

export default function Products() {
    const user = useAuthStore(state => state.user);
    const [products, setProducts] = useState([]);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        getAllProducts().then(setProducts);
        getAllSections().then(setSections);
    }, []);

    return <>
        <div className="flex flex-wrap justify-center items-center gap-5 m-5 flex-col sm:flex-row">
            {sections.map((section, i) => <SectionCard key={i} isStaff={user?.staff === true} {...section} />)}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-5 m-5 flex-col sm:flex-row">
            {products.map((product, i) => <ProductCard key={i} isStaff={user?.staff === true} {...product} />)}
        </div>
        {user?.staff &&
            <div className="flex justify-center flex-col sm:flex-row gap-5">
                <NewSectionForm added={(doc) => setSections(old => [...old, doc])} />
                <NewProductForm sections={sections} added={(doc) => setProducts(old => [...old, doc])} />
            </div>
        }
    </>;
}
