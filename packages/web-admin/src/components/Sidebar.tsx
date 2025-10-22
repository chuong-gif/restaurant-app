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
    TableOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        {
            key: "/admin",
            icon: <DashboardOutlined />,
            label: "Dashboard",
        },
        {
            key: "/admin/customers",
            icon: <UserOutlined />,
            label: "Customers",
        },
        {
            key: "/admin/products",
            icon: <ShoppingOutlined />,
            label: "Products",
        },
        {
            key: "/admin/reservations",
            icon: <CalendarOutlined />,
            label: "Reservations",
        },
        // 🟢 Thêm mục Đặt bàn (Tables)
        {
            key: "/admin/tables",
            icon: <TableOutlined />,
            label: "Đặt bàn",
        },
    ];

    return (
        <Sider
            collapsible
            style={{
                background: "#fff",
                borderRight: "1px solid #f0f0f0",
            }}
        >
            <div
                style={{
                    color: "#1890ff",
                    fontSize: 20,
                    fontWeight: 600,
                    textAlign: "center",
                    padding: "16px 0",
                    borderBottom: "1px solid #f0f0f0",
                }}
            >
                Admin Panel
            </div>

            <Menu
                theme="light"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={items}
                onClick={({ key }) => navigate(key)}
            />
        </Sider>
    );
}
