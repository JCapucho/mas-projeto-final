import { 
    createBrowserRouter,
    Navigate,
    Outlet,
} from "react-router-dom";

import useAuthStore from "./store/auth"
import useCartStore from "./store/cart"

import GuestRoot from './GuestRoot';
import UserRoot from './UserRoot';

import Landing from './pages/Landing';
import Features from './pages/Features';

import Login from './pages/Login';
import Register from './pages/Register';

import Appointments from './pages/Appointments';
import ProductsRoot from './pages/ProductsRoot';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccessful from './pages/PaymentSuccessful';

import { LoadingComponent, NotFound, ErrorPage } from './utils';

function ProtectedRoute({ children, loggedIn = true, redirect = "/" }) {
    const { loaded, user } = useAuthStore(state => ({ loaded: state.loaded, user: state.user }));

    return <LoadingComponent loading={!loaded}>
        {(user !== null) === loggedIn ? children : <Navigate to={redirect} replace />}
    </LoadingComponent>
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

const userRoutes = [
    {
        name: "Appointments",
        path: "appointments/*",
        navbarTo: "appointments",
        element: <Appointments />,
    },
    {
        name: "Products",
        path: "products/*",
        navbarTo: "products",
        element: <ProductsRoot />,
    }
];

export { boardingRoutes, userRoutes };

export default createBrowserRouter([
    {
        path: "/",
        element: <Outlet />,
        errorElement: <ErrorPage />,
        children: [
            // Guest Routes
            {
                path: "",
                element: <GuestRoot />,
                children: [
                    {
                        index: true,
                        element: <Landing />,
                    }
                ].concat(boardingRoutes)
            },
            // Authentication routes
            {
                path: "/login",
                element: <ProtectedRoute loggedIn={false} redirect={"/dashboard"}><Login /></ProtectedRoute>,
            },
            {
                path: "/register",
                element: <ProtectedRoute loggedIn={false} redirect={"/dashboard"}><Register /></ProtectedRoute>,
            },
            // Logged in routes
            {
                path: "/dashboard",
                element: <ProtectedRoute><UserRoot /></ProtectedRoute>,
                children: [
                    {
                        index: true,
                        element: <></>,
                    },
                    {
                        path: "cart",
                        element: <Cart />,
                    },
                    {
                        path: "paymentSucess",
                        element: <ProtectedRoute><PaymentSuccessful /></ProtectedRoute>,
                        action: async ({ request }) => {
                            const loadedAuth = new Promise(resolve => {
                                const state = useAuthStore.getState();
                                if (state.loaded)
                                    return resolve(state.user);

                                let unsub;
                                unsub = useAuthStore.subscribe(state => {
                                    if(state.loaded) {
                                        unsub();
                                        resolve(state.user);
                                    }
                                });
                            });

                            const user = await loadedAuth;

                            await useCartStore.getState().actions.storeDraft(user.id);

                            const formData = await request.formData();
                            return Object.fromEntries(formData);
                        }
                    },
                ].concat(userRoutes)
            },
            {
                path: "checkout",
                element: <ProtectedRoute><Checkout /></ProtectedRoute>,
            },
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);
