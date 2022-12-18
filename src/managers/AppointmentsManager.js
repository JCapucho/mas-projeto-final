import { collection, doc, getDocs, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/base";

import { usersCollection } from "./UserManager";
const appointmentsCollection = collection(db, 'appointments');

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
    const userRef = doc(usersCollection, userId);
    const q = query(appointmentsCollection, where("owner", "==", userRef));
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
