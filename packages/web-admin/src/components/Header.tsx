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
                background: "#fff",
                padding: "0 24px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
            }}
        >
            <Dropdown menu={{ items }}>
                <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
            </Dropdown>
        </AntHeader>
    );
}

