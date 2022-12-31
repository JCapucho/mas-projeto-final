import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, deleteField } from "firebase/firestore";

import { appointmentsCollection } from "./AppointmentsManager";

const getCollectionName = responsible => responsible ? "caller" : "callee";

export async function setOffer(id, offer) {
    const callRef = doc(appointmentsCollection, id, "private", "call");

    await setDoc(callRef, {
        offer: {
            type: offer.type,
            sdp: offer.sdp,
        },
    });
}

export async function setAnswer(id, answer) {
    const callRef = doc(appointmentsCollection, id, "private", "call");

    await updateDoc(callRef, {
        answer: {
            type: answer.type,
            sdp: answer.sdp,
        },
    });
}

export async function removeAnswer(id) {
    const callRef = doc(appointmentsCollection, id, "private", "call");

    await updateDoc(callRef, {
        answer: deleteField(),
    });
}

export async function removeCandidates(id, responsible) {
    const candidatesCollection = collection(appointmentsCollection, id, getCollectionName(responsible));

    const docs = await getDocs(candidatesCollection);
    const promises = [];

    docs.forEach(doc => {
        promises.push(deleteDoc(doc.ref));
    });

    await Promise.all(promises);
}

export async function cleanupCall(id) {
    const callRef = doc(appointmentsCollection, id, "private", "call");

    await Promise.all([
        deleteDoc(callRef),
        removeCandidates(id, true),
        removeCandidates(id, false)
    ])
}

export async function getOffer(id, offer) {
    const callRef = doc(appointmentsCollection, id, "private", "call");
    const callSnap = await getDoc(callRef);
    return callSnap.data().offer;
}

export async function addCandidate(id, responsible, candidate) {
    const candidatesCollection = collection(appointmentsCollection, id, getCollectionName(responsible));
    const candidateRef = doc(candidatesCollection);

    await setDoc(candidateRef, candidate.toJSON());
}

export function listenForNewCandidates(id, responsible, callback) {
    const candidatesCollection = collection(appointmentsCollection, id, getCollectionName(!responsible));

    return onSnapshot(candidatesCollection, snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') callback(change.doc.data())
        });
    });
}

export function listenForAnswers(id, callback) {
    const callRef = doc(appointmentsCollection, id, "private", "call");

    return onSnapshot(callRef, snapshot => {
        callback(snapshot.data());
    });
}
