import { Link } from "react-router-dom";

import useAuthStore from "../store/auth";
import useCartStore from "../store/cart";
import useAnimalsStore from "../store/animals";
import useAppointmentsStore from "../store/appointments";

import CartItems from "../components/CartItems"
import UserAppointmentEntry from "../components/UserAppointmentEntry"

import { LoadingComponent } from "../utils";

function AnimalEntry({ animal }) {
    return <div className="w-full flex rounded-lg shadow-lg bg-white px-6 py-4 justify-between">
        <div className="flex flex-col flex-grow items-start">
            <h1 className="text-gray-900 text-lg font-semibold text-center mb-2">{animal.name}</h1>
            <p>Born: {animal.born.toLocaleString('pt-PT', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            })}</p>
        </div>
    </div>
}

function AnimalsList() {
    const [animalsLoaded, animals] = useAnimalsStore(state => [
        state.loaded,
        state.animals,
    ]);

    return <div>
        <h1 className="text-2xl font-semibold text-center">My pets</h1>
        <LoadingComponent loading={!animalsLoaded}>
            <div className="flex flex-col mt-2 gap-5">
                {animals.map((animal, i) => <AnimalEntry key={i} animal={animal} />)}
            </div>
        </LoadingComponent>
        <div className="flex justify-center mt-4">
            <Link
                to={"animals"}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
            >
                View your pets
            </Link>
        </div>
    </div>;
}

function AppointmentsList() {
    const user = useAuthStore(state => state.user);
    const [appointmentsLoaded, appointments, aptsActions] = useAppointmentsStore(state => [
        state.loaded,
        state.appointments,
        state.actions,
    ]);

    return <div>
        <h1 className="text-2xl font-semibold text-center">My appointments</h1>
        <LoadingComponent loading={!appointmentsLoaded}>
            <div className="flex flex-col mt-2 gap-5">
                {appointments.map((appointment, i) =>
                    <UserAppointmentEntry
                        key={i}
                        appointment={appointment}
                        appointmentApproved={aptsActions.appointmentApproved}
                        user={user}
                    />
                )}
            </div>
            {appointments.length === 0 && <p>No appointments scheduled</p>}
        </LoadingComponent>
        <div className="flex justify-center mt-4">
            <Link
                to={"appointments"}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
            >
                Schedule an appointment
            </Link>
        </div>
    </div>;
}

function CartList() {
    const [cartLoaded, cart] = useCartStore(state => [
        state.loaded,
        state.currentCart
    ]);

    return <div>
        <h1 className="text-2xl font-semibold text-center">My cart</h1>
        <LoadingComponent loading={!cartLoaded}>
            <CartItems cart={cart} />
            {(!cart?.products || Object.keys(cart.products).length === 0) && <p>No products in the cart</p>}
        </LoadingComponent>
        <div className="flex justify-center mt-4">
            <Link
                to={"products"}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
            >
                Browse products
            </Link>
        </div>
    </div>;
}


export default function Dashboard() {
    const user = useAuthStore(state => state.user);
    const regularUser = !user.staff && !user.medic;

    return <div className="w-full m-5 flex flex-wrap gap-5 justify-around max-w-7xl mx-auto">
        {regularUser && <AnimalsList />}
        <AppointmentsList />
        {regularUser && <CartList />}
    </div>;
}
