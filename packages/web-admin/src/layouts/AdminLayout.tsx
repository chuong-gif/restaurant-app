import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {
    // return (
    //     <div className="flex min-h-screen bg-white text-gray-800">
    //         <Sidebar />
    //         <div className="flex-1 flex flex-col bg-gray-50">
    //             <Header />
    //             <main className="p-6 flex-1 overflow-y-auto">
    //                 <Outlet />
    //             </main>
    //         </div>
    //     </div>
    // );


    return (
        <div className="flex min-h-screen bg-gray-900 text-white">

            {/* Sidebar cố định bên trái */}
            <Sidebar />

            {/* Phần nội dung chính */}
            <div className="flex-1 flex flex-col">
                <Header />

                {/* Khu vực nội dung */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div
                        className="
              w-full
              max-w-[1600px]   /* Giới hạn rộng tối đa ~ full màn hình lớn */
              mx-auto           /* Căn giữa theo chiều ngang */
              bg-white          /* Nền trắng */
              p-8               /* Padding đều */
              rounded-xl        /* Bo góc mềm mại */
              shadow-md         /* Bóng nhẹ tạo chiều sâu */
            "
                    >
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

