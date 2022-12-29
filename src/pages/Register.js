import { useState } from "react"
import { LockClosedIcon } from '@heroicons/react/20/solid'
import { Link, useNavigate } from "react-router-dom";

import { EmailAlreadyInUse } from "../firebase/auth";
import { register } from "../managers/AuthManager";
import useAuthStore from "../store/auth";

import FormInput from "../components/FormInput";

import logo from '../logo.png';

export default function Register() {
    const navigate = useNavigate();
    const setUser = useAuthStore(state => state.setUser);

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
            const user = await register(email, password, firstName, lastName);
            setUser(user);
            navigate("/dashboard");
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
                            <FormInput
                                type="text"
                                name="first-name"
                                autoComplete="given-name"
                                value={firstName}
                                changed={setFirstName}
                                required
                            >
                                First name
                            </FormInput>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <FormInput
                                type="text"
                                name="last-name"
                                autoComplete="family-name"
                                value={lastName}
                                changed={setLastName}
                                required
                            >
                                Last name
                            </FormInput>
                        </div>
                        <div className="col-span-6">
                            <FormInput
                                type="email"
                                name="email-address"
                                autoComplete="email"
                                value={email}
                                changed={setEmail}
                                required
                            >
                                Email address
                            </FormInput>
                        </div>
                        <div className="col-span-6">
                            <FormInput
                                name="password"
                                type="password"
                                value={password}
                                changed={setPassword}
                                required
                            >
                                Password
                            </FormInput>
                        </div>
                        <div className="col-span-6">
                            <FormInput
                                name="repeatPassword"
                                type="password"
                                value={repeatPassword}
                                changed={setRepeatPassword}
                                required
                            >
                                Repeat Password
                            </FormInput>
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
