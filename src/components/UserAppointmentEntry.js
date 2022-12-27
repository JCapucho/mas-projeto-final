import GenericButton from "./GenericButton";

function StaffControls({appointment, appointmentApproved, user}) {
    if(!appointment.approved)
        return <GenericButton
            onClick={() => appointmentApproved(appointment)}
            className="mt-0"
        >
            Approve
        </GenericButton>
    else
        return <p className="text-green-700">Approved</p>
}

function DateRangeDisplay({range, className}) {
    const sameDay = range.start.getFullYear() === range.end.getFullYear()
        && range.start.getMonth() === range.end.getMonth()
        && range.start.getDate() === range.end.getDate();

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

    return <h1 className={className}>
        {range.start.toLocaleString('pt-PT', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })} - {formatDate(range.end)}
    </h1>
}

export default function UserAppointmentEntry({appointment, appointmentApproved, user}) {
    const actions = user.id === appointment.responsible.id
        ? <StaffControls appointment={appointment} user={user} appointmentApproved={appointmentApproved} />
        : !appointment.approved && <p className="text-red-700">Missing approval</p>;

    return <div className="w-full flex rounded-lg shadow-lg bg-white px-6 py-4 mt-5 justify-between">
        <div className="flex flex-col flex-grow items-start">
            <DateRangeDisplay range={appointment} />
            {appointment.modified && <DateRangeDisplay className="text-red-700" range={appointment.modified} />}
            <p>{appointment.info.reason}</p>
        </div>
        <div className="flex flex-col flex-grow items-end ml-10 justify-between">
            <h1>{appointment.location}</h1>
            {actions}
        </div>
    </div>
}

