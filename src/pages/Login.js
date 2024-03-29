import { useState } from "react"
import { LockClosedIcon } from "@heroicons/react/20/solid"
import { Link, useNavigate, useLocation } from "react-router-dom";

import { InvalidAuthError } from "../firebase/auth";
import { login } from "../managers/AuthManager";
import useAuthStore from "../store/auth";

import logo from "../logo.png";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const setUser = useAuthStore(state => state.setUser);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [banner, setBanner] = useState(null);

    async function submit(event) {
        event.preventDefault();
        try {
            const user = await login(email, password);
            setUser(user);
            navigate(location.state?.intent ?? "/dashboard", { replace: true });
        } catch (e) {
            if (e instanceof InvalidAuthError)
                setBanner("The provided email or password is not valid");
            else
                setBanner("There was an error while attempting to login");
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
                        Sign in to your account
                    </h2>
                </div>
                {banner !== null &&
                    <div className="mt-8 text-center border border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                        {banner}
                    </div>
                }
                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                        </span>
                        Sign in
                    </button>
                </form>

                <div className="flex justify-center items-center w-full">
                    <hr className="my-8 w-full h-px bg-gray-300 border-0" />
                    <span className="absolute left-1/2 px-3 font-medium text-gray-900 bg-white -translate-x-1/2">or</span>
                </div>

                <div>
                    <Link
                        to={"/register"}
                        state={location.state}
                        className="w-full block text-center rounded-md border-2 border-gray-500 bg-transparent text-gray-900 py-2 px-4 text-sm font-medium hover:border-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    )
}
