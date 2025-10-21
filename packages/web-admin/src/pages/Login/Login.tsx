import React from "react";
import { Form, Input, Button, message, Card } from "antd";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginAdminAsync } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading } = useAppSelector((state) => state.auth);

    const onFinish = async (values: { email: string; password: string }) => {
        try {
            const result = await dispatch(loginAdminAsync(values)).unwrap();
            message.success(`Chào mừng ${result.user.fullname || "Admin"}`);
            navigate("/admin/dashboard");
        } catch (err: any) {
            message.error(err || "Đăng nhập thất bại");
        }
    };

    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    //             <div className="w-full max-w-xl"> {/* 👈 Giới hạn chiều rộng form */}
    //                 <Card
    //                     title={<h2 className="text-center text-xl font-semibold">Đăng nhập Admin</h2>}
    //                     className="shadow-lg rounded-xl border border-gray-200"
    //                 >
    //                     <Form
    //                         layout="vertical"
    //                         onFinish={onFinish}
    //                         className="p-4 md:p-6"
    //                     >
    //                         <Form.Item
    //                             label="Email"
    //                             name="email"
    //                             rules={[
    //                                 { required: true, message: "Vui lòng nhập email!" },
    //                                 { type: "email", message: "Email không hợp lệ!" },
    //                             ]}
    //                         >
    //                             <Input placeholder="Nhập email" size="large" />
    //                         </Form.Item>

    //                         <Form.Item
    //                             label="Mật khẩu"
    //                             name="password"
    //                             rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
    //                         >
    //                             <Input.Password placeholder="••••••••" size="large" />
    //                         </Form.Item>

    //                         <Form.Item>
    //                             <Button
    //                                 type="primary"
    //                                 htmlType="submit"
    //                                 loading={loading}
    //                                 size="large"
    //                                 className="w-full bg-blue-600 hover:bg-blue-700"
    //                             >
    //                                 Đăng nhập
    //                             </Button>
    //                         </Form.Item>
    //                     </Form>
    //                 </Card>
    //             </div>
    //         </div>
    //     );
    // };

    // export default Login;


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md px-4">
                <Card
                    title={
                        <h2 className="text-center text-white text-xl font-semibold">
                            Đăng nhập Admin
                        </h2>
                    }
                    className="bg-gray-800 border-none shadow-xl rounded-2xl"
                >
                    <Form layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            label={<span className="text-gray-200">Email</span>}
                            name="email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email!" },
                                { type: "email", message: "Email không hợp lệ!" },
                            ]}
                        >
                            <Input placeholder="Nhập email" size="large" />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-gray-200">Mật khẩu</span>}
                            name="password"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                        >
                            <Input.Password placeholder="••••••••" size="large" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                size="large"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
