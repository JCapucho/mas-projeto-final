import { createStore } from "./utils";

import {
    getUserAppointments,
    getResponsibleAppointments,
    getAppointmentInfo,
    approveAppointment 
} from "../managers/AppointmentsManager";

import { addLogoutHook } from "./auth";

const useAppointmentsStore = createStore("AppointmentsStore", (set) => ({
    appointments: [],

    actions: {
        removeAll: () => set({ appointments: [] }),
        appointmentApproved: async (appointment) => {
            await approveAppointment(appointment.id, appointment.modified);

            appointment.approved = true;

            if(appointment.modified) {
                appointment.start = appointment.modified.start;
                appointment.end = appointment.modified.end;
                delete appointment.modified;
            }

            set((state) => {
                const appointments = [...state.appointments];
                const i = appointments.findIndex(apt => apt.id === appointment.id);

                appointments[i] = appointment;

                return { appointments }
            });
        },
        rescheduleAppointment: (id, start, end) => set((state) => {
            const appointments = [...state.appointments];
            const appointment = appointments.find(apt => apt.id === id);

            if (appointment.start.getTime() !== start.getTime() ||
                appointment.end.getTime() !== end.getTime()) {
                appointment.modified = { start, end };
            } else if (appointment.modified) {
                delete appointment.modified;
            }

            return { appointments }
        }),
        scheduleAppointment: (appointment) => {
            set(state => ({ appointments: [...state.appointments, appointment] }));
        },

        loadUserAppointments: async (userId) => {
            let apts = await getUserAppointments(userId);

            apts = await Promise.all(apts.map(async (apt) => {
                apt.info = await getAppointmentInfo(apt.id);
                return apt;
            }));

            set((state) => {
                const newApts = state.appointments
                    .filter(apt => apt.owner.id !== userId)
                    .concat(apts);
                return { appointments: newApts }
            })
        },
        loadResponsibleAppointments: async (userId) => {
            let apts = await getResponsibleAppointments(userId);

            apts = await Promise.all(apts.map(async (apt) => {
                apt.info = await getAppointmentInfo(apt.id);
                return apt;
            }));

            set((state) => {
                const newApts = state.appointments
                    .filter(apt => apt.responsible.id !== userId)
                    .concat(apts);
                return { appointments: newApts }
            })
        },
    },
}));

addLogoutHook(async () => {
    useAppointmentsStore.getState().actions.removeAll();
});

export default useAppointmentsStore;
