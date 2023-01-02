import { useState, useEffect } from 'react';

import useAuthStore from "../store/auth"

import { scheduleByMedic } from "../managers/AppointmentsManager";
import { getAllMedics } from "../managers/UserManager";

import { FormTextarea, FormCheckbox } from "./FormInput";
import RadioInput from "./RadioInput";
import GenericButton from "./GenericButton";

import { LoadingComponent } from "../utils";

export default function ScheduleAppointmentMedic({ medicSelected, newEvent, onScheduledAppointment }) {
    const userId = useAuthStore(state => state.user?.id);

    const [reason, setReason] = useState("");
    const [remote, setRemote] = useState(false);
    const [selected, setSelected] = useState(null);
    const [medics, setMedics] = useState([]);

    const [loading, setLoading] = useState(true);
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        getAllMedics().then(medics => {
            setMedics(medics);
            setLoading(false);
        });
    }, []);

    function onChange(medic) {
        setSelected(medic);
        medicSelected(medic);
    }

    async function submit(event) {
        event.preventDefault();

        if(selected === null) return setBanner("Select a medic");

        if(newEvent === null) return setBanner("Select a time for the appointment");

        setBanner(null);

        try {
            const appointment = await scheduleByMedic(
                { reason, remote },
                selected.id,
                newEvent,
                userId
            );
            onScheduledAppointment(appointment);

            // Reset form
            setReason("");
            setRemote(false);
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
                label={"Medic"}
                selected={selected}
                onChange={onChange}
                options={medics}
                render={medic => ({
                    label: `Dr. ${medic.lastName}`,
                    description: `${medic.speciality}`
                })} />
        </LoadingComponent>
        <FormCheckbox value={remote} changed={setRemote}>
            Remote appointment
        </FormCheckbox>
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
