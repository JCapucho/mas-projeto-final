import { useState, useEffect, useRef } from 'react';
import { Link, Routes, Route, useResolvedPath, useMatch, Navigate, useNavigate } from 'react-router-dom';

import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';

import { classNames } from "../utils";

import useAuthStore from "../store/auth"
import useAppointmentsStore from "../store/appointments"

import {
    getResponsibleAppointments,
    getLocationAppointments,
} from "../managers/AppointmentsManager";

import UserAppointmentEntry from "../components/UserAppointmentEntry";
import ScheduleAppointmentMedic from "../components/ScheduleAppointmentMedic";
import ScheduleAppointmentClinic from "../components/ScheduleAppointmentClinic";

import { LoadingComponent } from '../utils';

function UserOnlyRoute({ children }) {
    const { loaded, user } = useAuthStore(state => ({ loaded: state.loaded, user: state.user }));

    return <LoadingComponent loading={!loaded}>
        {user.staff || user.medic ? <Navigate to={".."} replace /> : children}
    </LoadingComponent>
}

function toUserEvent(user, appointment) {
    const isOwner = user.id === appointment.owner.id;

    const event = {
        title: appointment.info.reason,
        start: appointment.start,
        end: appointment.end,
        backgroundColor: appointment.approved
            ? isOwner ? undefined : "#6BC25D"
            : "#9C0808B0",
        extendedProps: { appointment }
    };

    if (appointment.modified) {
        event.start = appointment.modified.start;
        event.end = appointment.modified.end;
    }

    if (appointment.approved) event.editable = false;

    return event;
}

function toGenericEvent(appointment) {
    return {
        start: appointment.start,
        end: appointment.end,
        display: 'background'
    }
}

function UserAppointments() {
    const user = useAuthStore(state => state.user);
    const [appointments, aptsActions] = useAppointmentsStore(
        state => [state.appointments, state.actions]
    );

    return appointments.map((appointment, i) =>
        <UserAppointmentEntry
            key={i}
            appointment={appointment}
            appointmentApproved={aptsActions.appointmentApproved}
            user={user}
        />
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
    const calendarRef = useRef();
    const navigate = useNavigate();

    const [appointments, aptsActions] = useAppointmentsStore(
        state => [state.appointments, state.actions]
    );

    const user = useAuthStore(state => state.user);
    const isRegularUser = !(user.staff || user.medic);

    const [loading, setLoading] = useState(true);
    const [newEvent, setNewEvent] = useState(null);
    const [additionalEvents, setAdditionalEvents] = useState([]);

    const resolver = useResolvedPath("");
    const match = useMatch({ path: resolver.pathname, end: true });

    useEffect(() => {
        aptsActions.loadUserAppointments(user.id).then(() => {
            setLoading(false);
        });

        if(user.medic)
            aptsActions.loadResponsibleAppointments(user.id);
    }, [user, aptsActions]);

    function loadAdditionalEvents(appointments) {
        const events = appointments.map(toGenericEvent);

        setNewEvent(null);
        setAdditionalEvents(events)
    }

    async function medicChanged(medic) {
        const appointments = await getResponsibleAppointments(medic.id);
        loadAdditionalEvents(appointments)
    }

    async function locationChanged(location) {
        const appointments = await getLocationAppointments(location.name);
        loadAdditionalEvents(appointments)
    }

    function createNewSlot(info) {
        const event = {
            start: info.start,
            end: info.end,
            title: "New appointment",
            backgroundColor: "#6BC25DB0",
        };

        setNewEvent(event);
    }

    function onScheduledAppointment(appointment) {
        aptsActions.scheduleAppointment(appointment);
        navigate("");
    }

    function eventModified(info) {
        aptsActions.rescheduleAppointment(
            info.event.extendedProps.appointment.id,
            info.event.start,
            info.event.end,
        );
    }

    const userOptions = [
        { name: 'Schedule with a medic', to: "medic"},
        { name: 'Schedule with a clinic', to: "clinic"}
    ];

    if (appointments.length > 0)
        userOptions.unshift({ name: 'My appointments', to: "" });

    function setCalendarDays(calendar, el) {
        let days = 4;
        const width = el.offsetWidth;

        console.log(width);

        if (width < 350)
            days = 2
        else if (width < 700)
            days = 3

        calendar.setOption('duration', { days });
    }

    useEffect(() => {
        const calendar = calendarRef.current;
        setCalendarDays(calendar.getApi(), calendar.elRef.current);
    }, []);

    return <div className="flex flex-col lg:flex-row p-5 gap-5 mx-auto max-w-7xl">
        <div>
            {isRegularUser &&
            <div className="flex text-sm font-medium text-center text-gray-500 rounded-lg divide-x divide-gray-200 shadow items-stretch">
                {userOptions.map((data, i) => 
                    <SelectionLink
                        key={i}
                        to={data.to}
                        className={classNames(
                            i === 0 && "rounded-l-lg",
                            i === userOptions.length && "rounded-r-lg"
                        )}
                    >
                        {data.name}
                    </SelectionLink>
                )}
            </div>}

            <div className="my-5">
                <Routes>
                    <Route
                        index
                        element={<LoadingComponent loading={loading}>
                            {appointments.length > 0
                            ? <UserAppointments />
                            : <Navigate to={"medic"} replace />}
                        </LoadingComponent>}
                    />
                    <Route
                        path="medic"
                        element={<UserOnlyRoute>
                            <ScheduleAppointmentMedic
                                medicSelected={medicChanged}
                                newEvent={newEvent}
                                onScheduledAppointment={onScheduledAppointment}
                            />
                        </UserOnlyRoute>}
                    />
                    <Route
                        path="clinic"
                        element={<UserOnlyRoute>
                            <ScheduleAppointmentClinic
                                locationSelected={locationChanged}
                                newEvent={newEvent}
                                onScheduledAppointment={onScheduledAppointment}
                            />
                        </UserOnlyRoute>}
                    />
                </Routes>
            </div>
        </div>
        <div className="flex-grow">
            <FullCalendar
                ref={calendarRef}
                plugins={[interactionPlugin, timeGridPlugin]}

                initialView={"timeGrid"}
                duration={{ days: 4 }}
                businessHours={{
                    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                    startTime: '07:00',
                    endTime: '20:00'
                }}
                windowResize={function() {
                    setCalendarDays(this, this.el)
                }}
                allDaySlot={false}

                validRange={function(nowDate) {
                    return { start: nowDate };
                }}
                eventSources={[
                    appointments.map((apt) => toUserEvent(user, apt)),
                    additionalEvents,
                    ...(!match && newEvent ? [[newEvent]] : [])
                ]}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                    hour12: false
                }}
                eventContent={renderEventContent}

                editable={!isRegularUser}
                eventResizableFromStart={true}
                eventOverlap={false}
                eventAllow={function(info, event) {
                    const appointment = event.extendedProps.appointment;
                    return info.start.getTime() !== info.end.getTime()
                        && info.start >= appointment.start
                        && info.end <= appointment.end;
                }}
                eventDrop={eventModified}
                eventResize={eventModified}

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
            <br />
            {eventInfo.event.title}
        </>
    )
}
