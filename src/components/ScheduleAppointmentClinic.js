import { useState, useEffect } from 'react';

import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'

import useAuthStore from "../store/auth"

import { scheduleByClinic } from "../managers/AppointmentsManager";
import { getAllLocations } from "../managers/LocationsManager";

import { FormTextarea, FormCheckbox } from "./FormInput";
import GenericButton from "./GenericButton";

export default function ScheduleAppointmentClinic({ locationSelected, newEvent, onScheduledAppointment }) {
    const userId = useAuthStore(state => state.user?.id);

    const [reason, setReason] = useState("");
    const [selected, setSelected] = useState(null);
    const [locations, setLocations] = useState([]);

    const [banner, setBanner] = useState(null);

    useEffect(() => {
        getAllLocations().then(setLocations);
    }, []);

    function onChange(location) {
        setSelected(location);
        locationSelected(location);
    }

    async function submit(event) {
        event.preventDefault();

        if(selected === null) return setBanner("Select a medic");

        if(newEvent === null) return setBanner("Select a time for the appointment");

        setBanner(null);

        try {
            const appointment = await scheduleByClinic(reason, selected, newEvent, userId);
            onScheduledAppointment(appointment);

            // Reset form
            setReason("");
        } catch(e) {
            console.error(e);
            setBanner("There was an error while attempting to schedule the appointment");
        }
    }

    return <form onSubmit={submit}>
        {banner !== null &&
            <div className="my-5 border border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                {banner}
            </div>
        }

        <RadioGroup value={selected} onChange={onChange} className="mb-5">
            <RadioGroup.Label className="sr-only">Medic</RadioGroup.Label>
            <div className="space-y-2">
                {locations.map((location) => (
                    <RadioGroup.Option
                        key={location.id}
                        value={location}
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
                                            {location.name}
                                        </RadioGroup.Label>
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

        <FormTextarea
            rows="3"
            value={reason}
            changed={setReason}
            required
        >
            Reason for appointment
        </FormTextarea>
        <GenericButton
            type="submit"
            className="block mx-auto"
        >
            Schedule appointment
        </GenericButton>
    </form>;
}
