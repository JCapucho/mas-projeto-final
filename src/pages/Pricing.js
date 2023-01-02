import { classNames } from "../utils";

function PricingCard({ name, price, best = false, sellingPoints = [] }) {
    return <div
        className={classNames(
            "relative max-w-xs p-4 rounded-lg shadow-lg w-72 flex flex-col",
            best ? "bg-indigo-600 text-white border-2 border-yellow-500" : "bg-white text-black"
        )}
    >
        {best && <p className="absolute top-0 right-0 p-1 bg-yellow-500 rounded-bl text-black">
            Most popular
        </p>}
        <p className="pt-4 text-2xl font-bold leading-normal text-center">
            {name}
        </p>
        <p className="pb-4 text-4xl font-bold leading-normal text-center font-inter">
            <span className="text-base font-medium leading-loose text-center uppercase font-inter">
                €
            </span>
                {price}
            <span className="text-sm font-bold leading-tight text-center opacity-50 font-inter">
                /pet/month
            </span>
        </p>
        <ul className="flex-grow">
            {sellingPoints.map((point, i) => <li
                key={i}
                className="py-4 text-xs font-medium leading-normal text-center border-t border-gray-300 font-inter"
            >
                {point}
            </li>)}
        </ul>
        <div className="py-4 text-center">
            <button 
                className={classNames(
                    "py-2 px-4 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg",
                    best ? "bg-white text-black hover:bg-slate-300 focus:ring-slate-100 focus:ring-offset-indigo-200"
                         : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200"
                )}
            >
                Try it free
            </button>
        </div>
    </div>;
}

export default function Pricing() {
    return <div className="flex flex-wrap justify-center p-10 gap-5">
        <PricingCard name={'Basic'} price={9} sellingPoints={[
            "Up to 5 appointments per month",
            "Track your pet's growth",
            "Receive custom diet plans",
            "Receive home",
        ]} />
        <PricingCard name={'Advanced'} price={15} best={true} sellingPoints={[
            "All the basic plan features plus",
            "Up to 10 appointments per month",
            "Half the shipping fees",
            "Access to remote appointments",
        ]} />
        <PricingCard name={'Best Friend'} price={19} sellingPoints={[
            "All the pro plan features plus",
            "Unlimited appointments",
            "No shipping fees",
            "Access to exclusive discounts",
        ]} />
    </div>
}
