import { useState } from "react"
import { LockClosedIcon } from '@heroicons/react/20/solid'
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmailAndPassword, EmailAlreadyInUse } from "./firebase";
import logo from './logo.png';

export default function Register() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [banner, setBanner] = useState(null);

    async function submit(event) {
        event.preventDefault();

        if (password !== repeatPassword) {
            setBanner("Passwords don't match");
            return
        }

        try {
            await registerWithEmailAndPassword(email, password, firstName, lastName);
            navigate("/");
        } catch (e) {
            if (e instanceof EmailAlreadyInUse)
                setBanner("The provided email is already in use");
            else
                setBanner("There was an error while attempting to register");
        }
    }

    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div>
                    <Link to={"/"}>
                        <img
                            className="mx-auto h-12 w-auto"
                            src={logo}
                            alt="PetYard"
                        />
                    </Link>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign up for a new account
                    </h2>
                </div>
                {banner !== null &&
                    <div className="mt-8 text-center border border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                        {banner}
                    </div>
                }
                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="grid grid-cols-6 gap-x-6 gap-y-2">
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                First name
                            </label>
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                                required
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                Last name
                            </label>
                            <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autoComplete="family-name"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                                required
                            />
                        </div>
                        <div className="col-span-6">
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                type="text"
                                name="email-address"
                                id="email-address"
                                autoComplete="email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div className="col-span-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>
                        <div className="col-span-6">
                            <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700">
                                Repeat Password
                            </label>
                            <input
                                id="repeatPassword"
                                name="repeatPassword"
                                type="password"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={repeatPassword}
                                onChange={(event) => setRepeatPassword(event.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                            </span>
                            Register a new account
                        </button>
                    </div>
                </form>

                <div className="flex justify-center items-center w-full">
                    <hr className="my-8 w-full h-px bg-gray-300 border-0" />
                    <span className="absolute left-1/2 px-3 font-medium text-gray-900 bg-white -translate-x-1/2">Already have an account?</span>
                </div>

                <div>
                    <Link
                        to={"/login"}
                        className="w-full block text-center rounded-md border-2 border-gray-500 bg-transparent text-gray-900 py-2 px-4 text-sm font-medium hover:border-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}
