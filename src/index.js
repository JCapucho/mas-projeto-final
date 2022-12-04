import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

import App from './App';

import GuestRoot from './GuestRoot';

import Landing from './Landing';
import Features from './Features';

import Login from './Login';
import Register from './Register';

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
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
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
