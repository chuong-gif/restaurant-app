import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Products from "../pages/Products";
import { Login } from "../pages/Login/Login"; // 👈 Route login

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { path: "", element: <Dashboard /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "customers", element: <Customers /> },
            { path: "products", element: <Products /> },
        ],
    },
]);
