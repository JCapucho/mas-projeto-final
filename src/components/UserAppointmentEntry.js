import { useState, useEffect } from 'react';

import { getAppointmentInfo } from "../managers/AppointmentsManager";

export default function UserAppointmentEntry({appointment}) {
    const [info, setInfo] = useState([]);

    useEffect(() => {
        getAppointmentInfo(appointment.id).then(setInfo);
    }, [appointment]);

    const sameDay = appointment.start.getFullYear() === appointment.end.getFullYear()
        && appointment.start.getMonth() === appointment.end.getMonth()
        && appointment.start.getDate() === appointment.end.getDate();

    const formatDate = (date) => sameDay
        ? date.toLocaleTimeString('pt-PT', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : date.toLocaleString('pt-PT', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

    return <div className="w-full rounded-lg shadow-lg bg-white px-6 py-4">
        <div className="flex justify-between">
            <h1>{formatDate(appointment.start)} - {formatDate(appointment.end)}</h1>
            <h1>{appointment.location}</h1>
        </div>
        <p>{info.reason}</p>
    </div>
}

