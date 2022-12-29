import { useActionData, Navigate, Link } from "react-router-dom";
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function PaymentSuccessful() {
    const actionData = useActionData();

    if (actionData) {
        return <>
            <CheckCircleIcon className="text-green-700 h-60 w-60 mx-auto" />
            <h1 className="text-2xl font-semibold text-center mb-2">Payment successful</h1>
            {actionData.shipping !== "clinic" && <h1 className="text-xl text-center">
                Your order will be shipped shortly
            </h1>}
            {actionData.shipping === "clinic" && <h1 className="text-xl text-center">
                You'll receive a message when your order is ready to be picked up
            </h1>}
            <div className="flex justify-center mt-4">
                <Link
                    to={".."}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
                >
                    Back to homepage
                </Link>
            </div>
        </>;
    } else {
        return <Navigate to={".."} replace />
    }
}
