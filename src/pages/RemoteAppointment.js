import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MicrophoneIcon, VideoCameraIcon } from '@heroicons/react/24/solid';

import useAuthStore from "../store/auth";

import { getAppointment } from "../managers/AppointmentsManager";
import {
    setOffer,
    getOffer,
    setAnswer,
    removeAnswer,
    addCandidate,
    listenForNewCandidates,
    listenForAnswers,
    cleanupCall,
    removeCandidates,
} from "../managers/RemoteAppointmentManager";

import { LoadingComponent } from "../utils";

const configuration = {
    iceServers: [{
        urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
        ],
    }],
    iceCandidatePoolSize: 10,
};

class CallManager {
    peerConnection = null;
    localStream = null;
    remoteStream = null;

    setCallData(appointment, responsible) {
        this.aptId = appointment.id;
        this.responsible = responsible;
    }

    async openUserMedia(localVideo, remoteVideo) {
        this.localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        this.remoteStream = new MediaStream();

        localVideo.srcObject = this.localStream;
        remoteVideo.srcObject = this.remoteStream;
    }

    async startCall() {
        if(this.responsible)
            await cleanupCall(this.aptId);

        const self = this;
        const peerConnection = new RTCPeerConnection(configuration);

        peerConnection.addEventListener('iceconnectionstatechange ', () => {
        });

        this.localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, self.localStream);
        });

        peerConnection.addEventListener('icecandidate', event => {
            if (!event.candidate) {
                return;
            }
            addCandidate(self.aptId, self.responsible, event.candidate);
        });

        peerConnection.addEventListener('track', event => {
            event.streams[0].getTracks().forEach(track => {
                self.remoteStream.addTrack(track);
            });
        });

        peerConnection.oniceconnectionstatechange = function() {
            if(peerConnection.iceConnectionState === 'disconnected') {
                console.log(self);
                self.onDisconnect();
            }
        }

        if (this.responsible) {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            await setOffer(this.aptId, offer);

            listenForAnswers(this.aptId, async data => {
                if (!peerConnection.currentRemoteDescription && data && data.answer) {
                    const rtcSessionDescription = new RTCSessionDescription(data.answer);
                    await peerConnection.setRemoteDescription(rtcSessionDescription);
                }
            });
        } else {
            const offer = await getOffer(this.aptId);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            await setAnswer(this.aptId, answer);
        }

        listenForNewCandidates(this.aptId, this.responsible, async data => {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        });

        this.inCall = true;
        this.peerConnection = peerConnection;
    }

    async hangUp() {
        if (!this?.inCall) return;

        const tracks = this.localStream.getTracks();
        tracks.forEach(track => track.stop());

        if (this.remoteStream)
            this.remoteStream.getTracks().forEach(track => track.stop());

        if (this.peerConnection)
            this.peerConnection.close();

        if (!this.responsible) {
            await Promise.all([
                removeAnswer(this.aptId),
                removeCandidates(this.aptId, this.responsible)
             ]);
        } else {
            await cleanupCall(this.aptId);
        }

        this.inCall = false;
    }

    toggleMic(state) {
        this.localStream.getAudioTracks().forEach(track => track.enabled = state);
    }

    toggleCamera(state) {
        this.localStream.getVideoTracks().forEach(track => track.enabled = state);
    }
}

const manager = new CallManager();

function Call({ appointment, responsible, callEnded }) {
    const localVideo = useRef();
    const remoteVideo = useRef();

    const [waiting, setWaiting] = useState(!responsible);

    const [inCall, setInCall] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);

    useEffect(() => {
        manager.onDisconnect = callEnded;

        const unsub = listenForAnswers(appointment.id, async (data) => {
            if (data && data.offer && !responsible) {
                setWaiting(false);
            } else if (
                manager.inCall
                && ((!data?.offer && !responsible) || (!data?.answer && responsible))
            ) {
                callEnded();
            } else if (!responsible && (!data || !data.offer)) {
                setWaiting(true);
            }
        });

        return function() {
            manager.hangUp();
            unsub();
        }
    }, [appointment.id, responsible, callEnded]);

    return <div className="h-full relative bg-black flex flex-col justify-center">
        <video ref={remoteVideo} autoPlay playsInline />
        <video
            ref={localVideo}
            className="w-[25vw] absolute top-10 right-10 rounded"
            muted autoPlay playsInline />

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <div className="flex gap-5 bg-slate-500 rounded px-5 py-3">
                {waiting && <p className="my-auto text-white text-lg font-semibold">Waiting for medic</p>}
                {!waiting && !inCall && <button
                    className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={async () => {
                        setInCall(true);
                        await manager.openUserMedia(localVideo.current, remoteVideo.current);
                        manager.startCall()
                    }}
                >
                    {responsible ? "Start" : "Join"} call
                </button>}
                {inCall && <>
                    <button
                        className="mx-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={callEnded}
                    >
                        Hang Up
                    </button>
                    <button
                        className={
                            "mx-auto bg-slate-600 hover:bg-slate-700 font-bold py-2 px-4 rounded "
                            + (!audioEnabled ? "text-red-500" : "text-white")
                        }
                        onClick={() => {
                            setAudioEnabled(old => {
                                manager.toggleMic(!old)
                                return !old;
                            });
                        }}
                    >
                        <MicrophoneIcon className="h-6 w-6" />
                    </button>
                    <button
                        className={
                            "mx-auto bg-slate-600 hover:bg-slate-700 font-bold py-2 px-4 rounded "
                            + (!videoEnabled ? "text-red-500" : "text-white")
                        }
                        onClick={() => {
                            setVideoEnabled(old => {
                                manager.toggleCamera(!old)
                                return !old;
                            });
                        }}
                    >
                        <VideoCameraIcon className="h-6 w-6" />
                    </button>
                </>}
            </div>
        </div>
    </div>;
}

function CallEnded() {
    return <div className="flex-grow flex justify-center items-center">
        <div className="p-10 rounded-md bg-slate-600 text-white">
            <h1 className="my-auto text-2xl font-semibold text-center mb-5">The call has ended</h1>
            <Link
                to={"/dashboard/appointments"}
                className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Return to appointments
            </Link>
        </div>
    </div>
}

export default function RemoteAppointment() {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const { appointmentId } = useParams();

    const [callEnded, setCallEnded] = useState(false);
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        getAppointment(appointmentId).then(appointment => {
            if (!appointment)
                return navigate("/dashboard/appointments");

            manager.setCallData(appointment, user.id === appointment.responsible.id);
            setAppointment(appointment);
        })
    }, [appointmentId, navigate, user.id]);

    return <LoadingComponent loading={!appointment}>
        {!callEnded && <Call
            appointment={appointment}
            responsible={user.id === appointment?.responsible?.id}
            callEnded={() => setCallEnded(true)} />}
        {callEnded && <CallEnded />}
    </LoadingComponent>;
}
