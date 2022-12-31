import { collection, doc, getDocs, getDoc, setDoc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/base";

import { usersCollection } from "./UserManager";

export const appointmentsCollection = collection(db, 'appointments');

/// Retrieves a list of all the appointments
///
/// # Returns
///
/// An Array of objects with the following shape:
/// ```
/// {
///   id: string,
///   start: Date,
///   end: Date,
///   location: string,
///   owner: FirebaseDocRef,
///   responsible: FirebaseDocRef,
///   approved: boolean,
/// }
/// ```
export async function getAppointments(from, to) {
    const q = query(
        appointmentsCollection,
        where("start", ">=", from),
        where("start", "<", to)
    );
    const appointmentsQuery = await getDocs(q);

    const appointments = [];
    appointmentsQuery.forEach((doc) => {
        const appointment = doc.data();
        appointment.id = doc.id;
        appointment.start = appointment.start.toDate();
        appointment.end = appointment.end.toDate();
        appointments.push(appointment);
    });

    return appointments;
}

/// Retrieves an appointment by id
///
/// # Returns
///
/// An object with the following shape:
/// ```
/// {
///   id: string,
///   start: Date,
///   end: Date,
///   location: string,
///   owner: FirebaseDocRef,
///   responsible: FirebaseDocRef,
///   approved: boolean,
/// }
/// ```
export async function getAppointment(id) {
    const aptRef = doc(appointmentsCollection, id);
    const aptSnap = await getDoc(aptRef);

    const appointment = aptSnap.data();

    if(!appointment) return;

    appointment.id = aptRef.id;
    appointment.start = appointment.start.toDate();
    appointment.end = appointment.end.toDate();

    return appointment;
}

/// Retrieves a list of all the appointments beloging to the user
///
/// # Returns
///
/// An Array of objects with the following shape:
/// ```
/// {
///   id: string,
///   start: Date,
///   end: Date,
///   location: string,
///   owner: FirebaseDocRef,
///   responsible: FirebaseDocRef,
///   approved: boolean,
/// }
/// ```
export async function getUserAppointments(userId) {
    const now = new Date();
    const userRef = doc(usersCollection, userId);
    const q = query(appointmentsCollection,
        where("owner", "==", userRef),
        where("end", ">=", now)
    );
    const appointmentsQuery = await getDocs(q);

    const appointments = [];
    appointmentsQuery.forEach((doc) => {
        const appointment = doc.data();
        appointment.id = doc.id;
        appointment.start = appointment.start.toDate();
        appointment.end = appointment.end.toDate();
        appointments.push(appointment);
    });

    return appointments;
}

/// Retrieves a list of all the appointments the user is responsible for
///
/// # Returns
///
/// An Array of objects with the following shape:
/// ```
/// {
///   id: string,
///   start: Date,
///   end: Date,
///   location: string,
///   owner: FirebaseDocRef,
///   responsible: FirebaseDocRef,
///   approved: boolean,
/// }
/// ```
export async function getResponsibleAppointments(userId) {
    const now = new Date();
    const userRef = doc(usersCollection, userId);
    const q = query(
        appointmentsCollection,
        where("responsible", "==", userRef),
        where("end", ">=", now)
    );
    const appointmentsQuery = await getDocs(q);

    const appointments = [];
    appointmentsQuery.forEach((doc) => {
        const appointment = doc.data();
        appointment.id = doc.id;
        appointment.start = appointment.start.toDate();
        appointment.end = appointment.end.toDate();
        appointments.push(appointment);
    });

    return appointments;
}

/// Retrieves a list of all the appointments in the given location
///
/// # Returns
///
/// An Array of objects with the following shape:
/// ```
/// {
///   id: string,
///   start: Date,
///   end: Date,
///   location: string,
///   owner: FirebaseDocRef,
///   responsible: FirebaseDocRef,
///   approved: boolean,
/// }
/// ```
export async function getLocationAppointments(location) {
    const q = query(appointmentsCollection, where("location", "==", location));
    const appointmentsQuery = await getDocs(q);

    const appointments = [];
    appointmentsQuery.forEach((doc) => {
        const appointment = doc.data();
        appointment.id = doc.id;
        appointment.start = appointment.start.toDate();
        appointment.end = appointment.end.toDate();
        appointments.push(appointment);
    });

    return appointments;
}

/// Retrieves an appointment private information
///
/// # Returns
///
/// An object with the following shape:
/// ```
/// {
///   reason: string,
/// }
/// ```
export async function getAppointmentInfo(id) {
    const infoRef = doc(appointmentsCollection, id, "private", "info");
    const appointmentSnap = await getDoc(infoRef);
    return appointmentSnap.data();
}

/// Adds a new unapproved appointment to the database where the responsible is
/// selected and the location is either remote or undecided
///
/// # Inputs
///
/// - `details`:
/// ```
/// {
///   reason: string,
///   remote: boolean,
/// }
/// ```
///
/// - `medicId`: `string`
///
/// - `timeslot`:
/// ```
/// {
///   start: Date,
///   end: Date,
/// }
/// ```
///
/// - `userId`: `string`
///
/// ```
/// # Returns
///
/// An object with the following shape:
/// ```
/// {
///   id: string,
///   start: Date,
///   end: Date,
///   location: string,
///   owner: FirebaseDocRef,
///   responsible: FirebaseDocRef,
///   approved: boolean,
///   info: { reason: string }
/// }
/// ```
export async function scheduleByMedic(details, medicId, timeslot, userId) {
    const ownerRef = doc(usersCollection, userId);
    const responsibleRef = doc(usersCollection, medicId);
    const appointmentRef = doc(appointmentsCollection);

    const data = {
        approved: false,
        owner: ownerRef,

        start: timeslot.start,
        end: timeslot.end,

        location: details.remote ? "Remoto" : null,
        responsible: responsibleRef
    };

    await setDoc(appointmentRef, data);
    data.id = appointmentRef.id;

    const infoRef = doc(appointmentRef, "private", "info");
    data.info = { reason: details.reason };
    await setDoc(infoRef, data.info);

    return data;
}

/// Adds a new unapproved appointment to the database where the location is selected
/// and the medic auto assigned.
///
/// # Inputs
///
/// - `reason`: `string`
//
/// - `location`:
/// ```
/// {
///   name: string,
///   responsible: FirebaseDocRef,
/// }
/// ```
///
/// - `timeslot`:
/// ```
/// {
///   start: Date,
///   end: Date,
/// }
/// ```
///
/// - `userId`: `string`
///
/// ```
/// # Returns
///
/// An object with the following shape:
/// ```
/// {
///   id: string,
///   start: Date,
///   end: Date,
///   location: string,
///   owner: FirebaseDocRef,
///   responsible: FirebaseDocRef,
///   approved: boolean,
///   info: { reason: string }
/// }
/// ```
export async function scheduleByClinic(reason, location, timeslot, userId) {
    const ownerRef = doc(usersCollection, userId);
    const appointmentRef = doc(appointmentsCollection);

    const data = {
        approved: false,
        owner: ownerRef,

        start: timeslot.start,
        end: timeslot.end,

        location: location.name,
        responsible: location.responsible
    };

    await setDoc(appointmentRef, data);
    data.id = appointmentRef.id;

    const infoRef = doc(appointmentRef, "private", "info");
    data.info = { reason: reason };
    await setDoc(infoRef, data.info);

    return data;
}

/// Approves a appointment, optionally modifying it
///
/// # Inputs
///
/// - `appointmentId`: `string`
export async function approveAppointment(appointmentId, modified) {
    const appointmentRef = doc(appointmentsCollection, appointmentId);
    
    let changes = { approved: true };

    if (modified)
        changes = {...changes, ...modified};

    await updateDoc(appointmentRef, changes);
}
