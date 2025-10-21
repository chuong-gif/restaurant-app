import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Products from "../pages/Products";
import Login from "../pages/Login/Login"; // 👉 Route login
import TableMapPage from "../pages/Reservations/TableMapPage";

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
    {
        path: "/admin/tables",
        element: <TableMapPage />,
    },
]); // ✅ thêm dấu ] và )


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AdminLayout from "../layouts/AdminLayout";
// import Dashboard from "../pages/Dashboard";
// import Customers from "../pages/Customers";
// import Products from "../pages/Products";
// import Reservations from "../pages/Reservations";
// import { Login } from "../pages/Login/Login";

// export default function AppRoutes() {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route element={<AdminLayout />}>
//                     <Route path="/" element={<Dashboard />} />
//                     <Route path="/customers" element={<Customers />} />
//                     <Route path="/products" element={<Products />} />
//                     <Route path="/reservations" element={<Reservations />} />
//                 </Route>
//             </Routes>
//         </Router>
//     );
// }
