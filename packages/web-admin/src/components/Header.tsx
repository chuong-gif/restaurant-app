// export default function Header() {
//     return (
//         <header className="bg-white shadow p-3 flex justify-end">
//             <span className="text-gray-600">Admin</span>
//         </header>
//     );
// }



import { Layout, Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;

export default function Header() {
    const items = [
        { key: "profile", label: "My Profile" },
        { key: "logout", label: "Logout" },
    ];

    return (
        <AntHeader
            style={{
                background: "#ffffff",
                padding: "0 24px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                height: "64px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                zIndex: 10,
                position: "sticky",
                top: 0,
            }}
        >
            <Dropdown menu={{ items }} placement="bottomRight">
                <Avatar
                    icon={<UserOutlined />}
                    style={{
                        cursor: "pointer",
                        backgroundColor: "#1677ff",
                    }}
                />
            </Dropdown>
        </AntHeader>
    );
}

