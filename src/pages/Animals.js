import { Link } from "react-router-dom";

import useAnimalsStore from "../store/animals";

import { LoadingComponent } from "../utils";

function AnimalCard({ animal }) {
    return <div className="self-stretch rounded-lg shadow-lg bg-white p-6 flex justify-between">
        <div className="flex flex-col flex-grow items-start">
            <h1 className="text-gray-900 text-lg font-semibold text-center mb-2">{animal.name}</h1>
            <p>Born: {animal.born.toLocaleString('pt-PT', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            })}</p>
            <p>Subscribed: {animal.subscriptionStart.toLocaleString('pt-PT', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            })}</p>
        </div>
        <div className="flex flex-col flex-grow items-end ml-10">
            <p>{animal.weight} kg</p>
            <p>{animal.height} cm</p>
        </div>
    </div>
}

export default function Animals() {
    const [loaded, animals] = useAnimalsStore(state => [
        state.loaded,
        state.animals,
    ]);

    return <>
        <LoadingComponent loading={!loaded}>
            <div className="flex flex-wrap justify-center items-center gap-5 m-5" data-thook="animals-list">
                {animals.map((animal, i) => <AnimalCard key={i} animal={animal} />)}
            </div>
        </LoadingComponent>
        <div className="flex justify-center mt-4">
            <Link
                to={"/newSubscription"}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
            >
                Subscribe another pet
            </Link>
        </div>
    </>;
}
