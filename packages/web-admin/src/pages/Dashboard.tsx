import { Typography } from "antd";

const { Title, Text } = Typography;

export default function Dashboard() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 w-full overflow-hidden">
            <Title
                level={1}
                className="text-white text-center !leading-normal !whitespace-normal !tracking-normal"
                style={{
                    marginBottom: "16px",
                    writingMode: "horizontal-tb",
                    transform: "rotate(0deg)", // ép chắc chắn không bị xoay
                    display: "block",
                    lineHeight: "1.2",
                }}
            >
                Welcome Admin
            </Title>

            <Text
                type="secondary"
                className="text-gray-300 text-center !leading-normal !whitespace-normal"
                style={{
                    fontSize: "18px",
                    writingMode: "horizontal-tb",
                    transform: "rotate(0deg)",
                    display: "block",
                    lineHeight: "1.2",
                }}
            >
                Chào mừng bạn đến với trang quản lý
            </Text>
        </div>
    );
}
