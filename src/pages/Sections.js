import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

import useAuthStore from "../store/auth";
import useSectionstore from "../store/sections";

import NewSectionForm from "../components/NewSectionForm";

import GenericCard from "../components/GenericCard";

export default function SectionsRoute() {
    const isStaff = useAuthStore(state => state.user?.staff === true);
    const [sections, actions] = useSectionstore(state => [
        state.sections,
        state.actions
    ]);

    const [sectionModal, setSectionModal] = useState(false);
    const [editSection, setEditSection] = useState(null);

    useEffect(() => {
        actions.loadSections()
    }, [actions]);

    return <>
        {isStaff && <NewSectionForm
            section={sections[editSection]}
            open={sectionModal}
            onClose={() => setSectionModal(false)}
        />}
        <div className="flex flex-wrap justify-center items-center gap-5 m-5">
            {sections.map((section, i) => 
                <GenericCard
                    key={i}
                    img={section.photo}
                    name={section.name}
                    header={
                        isStaff && <div className="flex justify-end gap-2">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded"
                                onClick={() => {
                                    setEditSection(i);
                                    setSectionModal(true);
                                }}
                            >
                                <PencilSquareIcon className="h-6 w-6" />
                            </button>
                            <button
                                className="bg-red-500 hover:bg-blue-700 text-white font-bold p-2 rounded"
                                onClick={() => actions.deleteSection(section.id)}
                            >
                                <TrashIcon className="h-6 w-6" />
                            </button>
                        </div>
                    }>
                    <Link
                        to={`section/${section.id}`}
                        className=" px-4 py-2.5 bg-red-500 text-xs leading-tight uppercase rounded shadow-md hover:bg-red-600 hover:shadow-lg focus:bg-red-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out"
                    >
                        View section
                    </Link>
                </GenericCard>
            )}
        </div>
        <div className="flex justify-center mt-4">
            <Link
                to={"all"}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
            >
                View all
            </Link>
        </div>
    </>;
}
