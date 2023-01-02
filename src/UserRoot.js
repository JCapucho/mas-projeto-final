import { Fragment, useEffect } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { Link, Outlet, useMatch, useResolvedPath, useNavigate } from "react-router-dom";

import { userRoutes } from "./router";
import { classNames } from "./utils";

import useAuthStore from "./store/auth";
import useCartStore from "./store/cart";
import useAnimalsStore from "./store/animals";

import logo from './logo.png';

function NavBarLink({ item, className, children }) {
    const resolver = useResolvedPath(item.path);
    const match = useMatch({ path: resolver.pathname, end: true });

    return <Link
        to={item.navbarTo ?? item.path}
        className={classNames(
            match ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            className,
            'px-3 py-2 rounded-md text-sm font-medium',
        )}
    >
        {children || item.name}
    </Link>
};

function CartLink() {
    const resolver = useResolvedPath("cart");
    const match = useMatch({ path: resolver.pathname, end: true });

    const [cart, productsInCart] = useCartStore(state => [state.currentCart, state.productsInCart]);
    const itemCount = productsInCart(cart);

    return <NavBarLink item={{ path: "cart" }} className="relative">
        <ShoppingCartIcon className="h-6 w-6 text-white" />
        <span className="sr-only">Shopping cart</span>
        {!match
            && itemCount > 0
            && <div className="inline-flex absolute -top-0.5 -right-0.5 justify-center items-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border border-white">
                {itemCount}
            </div>}
    </NavBarLink>;
}

export default function UserRoot() {
    const navigate = useNavigate();
    const authActions = useAuthStore(state => state.actions);
    const [animalsLoaded, animals] = useAnimalsStore(state => [
        state.loaded,
        state.animals,
    ]);

    useEffect(() => {
        if (animalsLoaded && animals.length === 0)
            navigate("/newSubscription")
    }, [animals, animalsLoaded, navigate]);

    function logout() {
        authActions.logout();
        navigate("/");
    }

    return (
        <>
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <Link className="flex flex-shrink-0 items-center" to={"/dashboard"}>
                                        <img
                                            className="block h-8 w-auto"
                                            src={logo}
                                            alt="PetYard"
                                        />
                                    </Link>
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            {userRoutes.map((item) => <NavBarLink key={item.name} item={item} />)}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    <CartLink />
                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                    alt=""
                                                />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            to={"animals"}
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 w-full text-left')}
                                                        >
                                                            My pets
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 w-full text-left')}
                                                            onClick={logout}
                                                        >
                                                            Sign out
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 px-2 pt-2 pb-3">
                                {userRoutes.map((item) => <NavBarLink item={item} key={item.name} className="block" />)}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            <Outlet />
        </>
    )
}
