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
        { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
        { key: "/admin/customers", icon: <UserOutlined />, label: "Customers" },
        { key: "/admin/products", icon: <ShoppingOutlined />, label: "Products" },
        { key: "/admin/reservations", icon: <CalendarOutlined />, label: "Reservations" },
    ];

    return (
        <Sider
            theme="light"
            width={220}
            style={{
                height: "100vh",
                position: "sticky",
                top: 0,
                left: 0,
                overflowY: "auto",
                borderRight: "1px solid #f0f0f0",
                flexShrink: 0,
            }}
        >
            <div className="p-5 text-xl font-bold text-center border-b border-gray-200">
                Admin Panel
            </div>

            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={items}
                onClick={(item) => navigate(item.key)}
                style={{
                    height: "100%",
                    borderRight: 0,
                }}
            />
        </Sider>
    );
}
