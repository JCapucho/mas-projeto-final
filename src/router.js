import { createBrowserRouter, Navigate } from "react-router-dom";

import useAuthStore from "./store/auth"

import GuestRoot from './GuestRoot';
import UserRoot from './UserRoot';

import Landing from './pages/Landing';
import Features from './pages/Features';

import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute = ({ children, loggedIn = true, redirect = "/" }) => {
    const { loaded, user } = useAuthStore(state => ({ loaded: state.loaded, user: state.user }));

    if (loaded) {
        if ((user !== undefined) === loggedIn) {
            return children;
        } else {
            return <Navigate to={redirect} replace />;
        }
    } else {
        return <h1>Loading</h1>
    }
}

const boardingRoutes = [
    {
        name: "Features",
        path: "features",
        element: <Features />,
    },
    {
        name: "Pricing",
        path: "pricing",
        element: <h1>Pricing</h1>,
    }
];

export { boardingRoutes };

export default createBrowserRouter([
    {
        path: "/",
        element: <GuestRoot />,
        children: [
            {
                path: "/",
                element: <Landing />,
                navBarName: "Features"
            }
        ].concat(boardingRoutes)
    },
    {
        path: "/login",
        element: <ProtectedRoute loggedIn={false} redirect={"/dashboard"}><Login /></ProtectedRoute>,
    },
    {
        path: "/register",
        element: <ProtectedRoute loggedIn={false} redirect={"/dashboard"}><Register /></ProtectedRoute>,
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute><UserRoot /></ProtectedRoute>,
    },
]);
