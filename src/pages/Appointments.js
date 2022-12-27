import { useState, useEffect, useRef } from 'react';
import { Link, Routes, Route, useResolvedPath, useMatch, Navigate, useNavigate } from 'react-router-dom';

import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';

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
    return appointments.map((appointment, i) =>
        <UserAppointmentEntry key={i} appointment={appointment} />
    );
}

function SelectionLink({ to, children, className, ...rest }) {
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
}

export default function Appointments() {
    const userId = useAuthStore(state => state.user?.id);
    const navigate = useNavigate();

    const calendarRef = useRef();

    const [loading, setLoading] = useState(true);

    const [newEvent, setNewEvent] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [eventsSources, setEventsSources] = useState([userEvents]);

    const resolver = useResolvedPath("");
    const match = useMatch({ path: resolver.pathname, end: true });

    useEffect(() => {
        getUserAppointments(userId).then(newApts => {
            setAppointments(newApts);
            setLoading(false);
        });
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

    function medicChanged(medic) {
        const eventsSource = async (info, success, failure) => {
            const appointments = await getMedicAppointments(medic.id);
            const events = await Promise.all(appointments.map(appointmentToEvent));

            success(events)
        };

        const newEventSources = [eventsSource];

        if (newEvent) newEventSources.push(newEvent);

        setEventsSources(newEventSources);
    }

    function locationChanged(location) {
        const eventsSource = async (info, success, failure) => {
            const appointments = await getLocationAppointments(location.name);
            const events = await Promise.all(appointments.map(appointmentToEvent));

            success(events)
        }

        const newEventSources = [eventsSource];

        if (newEvent) newEventSources.push(newEvent);

        setEventsSources(newEventSources);
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

    function createNewSlot(info) {
        const event = {
            start: info.start,
            end: info.end,
            title: "New event"
        };

        setNewEvent(event);
        setEventsSources(value => [value[0]].concat([[event]]));
    }

    function onScheduledAppointment(appointment) {
        setAppointments(old => [...old, appointment]);
        setEventsSources([userEvents]);
        navigate("");
    }


    const userOptions = [
        { name: 'Schedule with a medic', to: "medic"},
        { name: 'Schedule with a clinic', to: "clinic"}
    ];

    if (appointments.length > 0) {
        userOptions.unshift({
            name: 'My appointments',
            to: "",
            onClick: () => setEventsSources([userEvents])
        });
    }

    return <div className="flex flex-col lg:flex-row p-5 gap-5 mx-auto max-w-7xl">
        <div>
            <div className="flex text-sm font-medium text-center text-gray-500 rounded-lg divide-x divide-gray-200 shadow items-stretch">
                {userOptions.map((data, i) => 
                    <SelectionLink
                        key={i}
                        to={data.to}
                        className={classNames(
                            i === 0 && "rounded-l-lg",
                            i === userOptions.length && "rounded-r-lg"
                        )}
                        onClick={data.onClick}
                    >
                        {data.name}
                    </SelectionLink>
                )}
            </div>

            <div className="my-5">
                <Routes>
                    <Route
                        index
                        element={loading
                            ? <h1>Loading</h1>
                            : appointments.length > 0
                            ? <UserAppointments appointments={appointments} />
                            : <Navigate to={"medic"} replace />}
                    />
                    <Route
                        path="medic"
                        element={<ScheduleAppointmentMedic
                            medicSelected={medicChanged}
                            newEvent={newEvent}
                            onScheduledAppointment={onScheduledAppointment}
                        />}
                    />
                    <Route
                        path="clinic"
                        element={<ScheduleAppointmentClinic
                            locationSelected={locationChanged}
                            newEvent={newEvent}
                            onScheduledAppointment={onScheduledAppointment}
                        />}
                    />
                </Routes>
            </div>
        </div>
        <div className="flex-grow">
            <FullCalendar
                ref={calendarRef}
                plugins={[interactionPlugin, timeGridPlugin]}
                initialView='timeGridWeek'
                allDaySlot={false}
                validRange={function(nowDate) {
                    return { start: nowDate };
                }}
                eventSources={eventsSources}
                eventContent={renderEventContent}

                selectable={!match}
                selectOverlap={false}
                select={createNewSlot}
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
