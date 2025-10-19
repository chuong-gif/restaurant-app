// import { NavLink } from "react-router-dom";

// const menu = [
//     { to: "/admin", label: "Dashboard" },
//     { to: "/admin/customers", label: "Customers" },
//     { to: "/admin/products", label: "Products" },
// ];

// export default function Sidebar() {
//     return (
//         <aside className="w-64 bg-white border-r shadow-md">
//             <div className="p-4 font-bold text-lg">Restaurant Admin</div>
//             <nav>
//                 {menu.map((item) => (
//                     <NavLink
//                         key={item.to}
//                         to={item.to}
//                         className={({ isActive }) =>
//                             `block px-4 py-2 ${isActive ? "bg-blue-500 text-white" : "text-gray-700"}`
//                         }
//                     >
//                         {item.label}
//                     </NavLink>
//                 ))}
//             </nav>
//         </aside>
//     );
// }


import { Layout, Menu } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    ShoppingOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
        { key: "/customers", icon: <UserOutlined />, label: "Customers" },
        { key: "/products", icon: <ShoppingOutlined />, label: "Products" },
        { key: "/reservations", icon: <CalendarOutlined />, label: "Reservations" },
    ];

    return (
        <Sider theme="light" width={220}>
            <div className="p-4 font-bold text-xl text-center">Admin</div>
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={items}
                onClick={(item) => navigate(item.key)}
            />
        </Sider>
    );
}
