import { useState, useEffect } from 'react';

import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'

import { getAllMedics } from "../managers/UserManager";

import ScheduleAppointmentBase from "./ScheduleAppointmentBase";

export default function ScheduleAppointmentMedic({ medicSelected }) {
    const [selected, setSelected] = useState(null);
    const [medics, setMedics] = useState([]);

    useEffect(() => {
        getAllMedics().then(setMedics);
    }, []);

    function onChange(medic) {
        setSelected(medic);
        medicSelected(medic);
    }

    return <ScheduleAppointmentBase>
        <RadioGroup value={selected} onChange={onChange}>
            <RadioGroup.Label className="sr-only">Medic</RadioGroup.Label>
            <div className="space-y-2">
                {medics.map((medic) => (
                    <RadioGroup.Option
                        key={medic.id}
                        value={medic}
                        className={({ active, checked }) =>
                            `${
                                active
                                ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                                : ''
                            }
                            ${
                                checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
                            }
                            relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                        }
                    >
                        {({ active, checked }) => (
                        <>
                            <div className="flex w-full items-center justify-between">
                                <div className="flex items-center">
                                    <div className="text-sm">
                                        <RadioGroup.Label
                                            as="p"
                                            className={`font-medium  ${
                                              checked ? 'text-white' : 'text-gray-900'
                                            }`}
                                        >
                                            Dr. {medic.lastName}
                                        </RadioGroup.Label>
                                        <RadioGroup.Description
                                            as="span"
                                            className={`inline ${
                                              checked ? 'text-sky-100' : 'text-gray-500'
                                            }`}
                                        >
                                            {medic.speciality}
                                        </RadioGroup.Description>
                                    </div>
                                </div>
                                {checked && (
                                    <div className="shrink-0 text-white">
                                        <CheckIcon className="h-6 w-6" />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>
    </ScheduleAppointmentBase>;
}

