import { Typography } from "antd";

const { Title, Text } = Typography;

export default function Dashboard() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-900">
            <Title level={1} className="text-white mb-2">
                Welcome Admin
            </Title>
            <Text type="secondary" className="text-gray-300">
                Chào mừng bạn đến với trang quản lý
            </Text>
        </div>
    );
}
