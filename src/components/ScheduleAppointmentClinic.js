import { useState, useEffect } from 'react';

import useAuthStore from "../store/auth"

import { scheduleByClinic } from "../managers/AppointmentsManager";
import { getAllLocations } from "../managers/LocationsManager";

import { FormTextarea } from "./FormInput";
import RadioInput from "./RadioInput";
import GenericButton from "./GenericButton";

import { LoadingComponent } from "../utils";

export default function ScheduleAppointmentClinic({ locationSelected, newEvent, onScheduledAppointment }) {
    const userId = useAuthStore(state => state.user?.id);

    const [reason, setReason] = useState("");
    const [selected, setSelected] = useState(null);
    const [locations, setLocations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        getAllLocations().then(locations => {
            setLocations(locations);
            setLoading(false);
        });
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
            <div className="my-5 border border-red-400 rounded bg-red-100 px-4 py-3 text-red-700">
                {banner}
            </div>
        }

        <LoadingComponent loading={loading}>
            <RadioInput
                className="mb-5"
                label={"Clinic"}
                selected={selected}
                onChange={onChange}
                options={locations}
                render={location => ({
                    label: location.name,
                })} />
        </LoadingComponent>
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
