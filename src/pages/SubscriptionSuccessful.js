import { useActionData, Navigate, Link } from "react-router-dom";
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function PaymentSuccessful() {
    const actionData = useActionData();

    if (actionData !== undefined) {
        return <>
            <CheckCircleIcon className="text-green-700 h-60 w-60 mx-auto" />
            <h1 className="text-xl text-center">
                Subscription successfully activated, you can now enjoy the services
                offered by petlink.
            </h1>
            <div className="flex justify-center mt-4">
                <Link
                    to={"/dashboard/animals"}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
                >
                    See your pets
                </Link>
            </div>
        </>;
    } else {
        return <Navigate to={".."} replace />
    }
}
