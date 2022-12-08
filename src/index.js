import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";

import GuestRoot from './GuestRoot';

import Landing from './Landing';
import Features from './Features';

import Login from './Login';
import Register from './Register';

import useAuthStore from "./store/auth"

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestRoot />,
    children: [
      {
        path: "/",
        element: <Landing />
      },
      {
        path: "features",
        element: <Features />
      }
    ]
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
    element: <ProtectedRoute><h1>Dashboard</h1></ProtectedRoute>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
