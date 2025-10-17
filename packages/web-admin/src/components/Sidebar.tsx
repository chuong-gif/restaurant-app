import { NavLink } from "react-router-dom";

const menu = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/customers", label: "Customers" },
    { to: "/admin/products", label: "Products" },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r shadow-md">
            <div className="p-4 font-bold text-lg">Restaurant Admin</div>
            <nav>
                {menu.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `block px-4 py-2 ${isActive ? "bg-blue-500 text-white" : "text-gray-700"}`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
