import { useState, useEffect, useRef } from 'react';
import { Link, Routes, Route, useResolvedPath, useMatch } from 'react-router-dom';

import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

import useAuthStore from "../store/auth"

import {
    getAppointmentInfo,
    getUserAppointments,
    getLocationAppointments,
    getMedicAppointments
} from "../managers/AppointmentsManager";

import UserAppointmentEntry from "../components/UserAppointmentEntry";
import ScheduleAppointmentMedic from "../components/ScheduleAppointmentMedic";
import ScheduleAppointmentClinic from "../components/ScheduleAppointmentClinic";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function UserAppointments({appointments}) {
    return <div className="my-5">
        {appointments.map((appointment, i) => <UserAppointmentEntry key={i} appointment={appointment} />)}
    </div>
}

export default function Appointments() {
    const userId = useAuthStore(state => state.user?.id);

    const calendarRef = useRef();

    const [appointments, setAppointments] = useState([]);
    const [eventsSouce, setEventsSource] = useState(() => userEvents);

    useEffect(() => {
        getUserAppointments(userId).then(setAppointments);
    }, [userId]);

    useEffect(() => {
        calendarRef.current.getApi().refetchEvents()
    }, [appointments])

    function userEvents(info, success, failure) {
        // HACK: React doesn't provide the latest value for appointments as soon
        // as it changes, so we instead we use the value of the callback passed
        // to the setState function, this will always be the latest value.
        const resolve = async (appointments) => {
            const events = await Promise.all(appointments.map(appointmentToEvent));

            success(events)
        };
        setAppointments(latestAppointments => {
            resolve(latestAppointments);
            return latestAppointments;
        });
    }

    function medicEvents(id) {
        return async (info, success, failure) => {
            const appointments = await getMedicAppointments(id);
            const events = await Promise.all(appointments.map(appointmentToEvent));

            success(events)
        }
    }

    function locationEvents(location) {
        return async (info, success, failure) => {
            const appointments = await getLocationAppointments(location);
            const events = await Promise.all(appointments.map(appointmentToEvent));

            success(events)
        }
    }

    async function appointmentToEvent(appointment) {
        const isOwner = userId === appointment.owner.id;
        const event = {
            start: appointment.start,
            end: appointment.end,
            display: isOwner ? 'auto' : 'background'
        };

        if(isOwner) {
            const info = await getAppointmentInfo(appointment.id);
            event.title = info.reason;
        }

        return event;
    }

    const SelectionLink = ({ to, children, className, ...rest }) => {
        const resolver = useResolvedPath(to);
        const match = useMatch({ path: resolver.pathname, end: true });

        return <Link
            to={to}
            className={classNames(
                match ? "active text-gray-900 bg-gray-200" : "bg-white hover:text-gray-700 hover:bg-gray-100",
                className,
                "p-4 w-full text-gray-900"
            )}
            {...rest}
        >
            {children}
        </Link>
    };

    return <div className="flex flex-col lg:flex-row p-5 gap-5 mx-auto max-w-7xl">
        <div>
            <div className="flex text-sm font-medium text-center text-gray-500 rounded-lg divide-x divide-gray-200 shadow items-stretch">
                <SelectionLink to={""} className="rounded-l-lg" onClick={() => setEventsSource(() => userEvents)}>
                    My appointments
                </SelectionLink>
                <SelectionLink to={"medic"}>
                    Schedule with a medic
                </SelectionLink>
                <SelectionLink to={"clinic"} className="rounded-r-lg">
                    Schedule with a clinic
                </SelectionLink>
            </div>

            <Routes>
                <Route
                    index
                    element={<UserAppointments appointments={appointments} />}
                />
                <Route
                    path="medic"
                    element={<ScheduleAppointmentMedic medicSelected={(medic) => {
                        setEventsSource(() => medicEvents(medic.id))
                    }} />}
                />
                <Route path="clinic" element={<ScheduleAppointmentClinic locationSelected={(location) => {
                        setEventsSource(() => locationEvents(location.name))
                    }} />}
                />
            </Routes>
        </div>
        <div className="flex-grow">
            <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin]}
                initialView='timeGridWeek'
                allDaySlot={false}
                validRange={function(nowDate) {
                    return { start: nowDate };
                }}
                events={eventsSouce}
                eventContent={renderEventContent}
            />
        </div>
    </div>;
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}
