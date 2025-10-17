// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import { publicAdminRoutes } from './Routes/routes';
// import NotFound from './Components/NotFound';
// import Layout from './Layouts/Layout';
// import Login from './Pages/Authentication/Login';
// import Otp from './Pages/Authentication/Otp';
// import Forgot from './Pages/Authentication/Forgot';
// import ProtectedRoute from './Components/ProtectedRoute';
// import Redirect from './Components/Redirect';
// import './App.css';

// import ReservationDetail from './Pages/Reservations/ReservationDetail';
// import ReservationDetailTable from './Pages/Reservations/ReservationDetailTable';

// // 🧠 Định nghĩa kiểu route item (nếu chưa có trong routes.ts)
// interface AdminRoute {
//   path: string;
//   component: React.ComponentType;
//   permissions?: string[];
// }

// const App: React.FC = () => {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* 🏠 Trang chủ */}
//           <Route path="/" element={<Navigate to="/dashboard" />} />

//           {/* 🔐 Authentication routes */}
//           <Route
//             path="/login"
//             element={
//               <Redirect>
//                 <Login />
//               </Redirect>
//             }
//           />
//           <Route path="/otp" element={<Otp />} />
//           <Route path="/forgot" element={<Forgot />} />

//           {/* 🧭 Protected routes (cần đăng nhập) */}
//           <Route
//             path=""
//             element={<ProtectedRoute element={<Layout />} requiredPermissions={[]} />}
//           >
//             {publicAdminRoutes.map(
//               ({ path, component: Component, permissions }: AdminRoute) => (
//                 <Route
//                   key={path}
//                   path={path}
//                   element={
//                     <ProtectedRoute
//                       element={<Component />}
//                       requiredPermissions={permissions || []}
//                     />
//                   }
//                 />
//               )
//             )}
//           </Route>

//           {/* 📋 Chi tiết đặt bàn */}
//           <Route
//             path="reservation/detail/:id"
//             element={
//               <ProtectedRoute
//                 element={<ReservationDetail />}
//                 requiredPermissions={['Xem chi tiết đặt bàn']}
//               />
//             }
//           />
//           <Route
//             path="reservation/detail/table/:id"
//             element={
//               <ProtectedRoute
//                 element={<ReservationDetailTable />}
//                 requiredPermissions={['Xem chi tiết đặt bàn']}
//               />
//             }
//           />

//           {/* ❌ Trang không tồn tại */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

// 1. Thêm dấu {} và đổi tên cho phù hợp (hoặc dùng 'as')
import { router } from "./routes";
import { RouterProvider } from "react-router-dom"; // 2. Bạn cũng cần RouterProvider

function App() {
  // 3. Sử dụng RouterProvider để cung cấp router cho ứng dụng
  return <RouterProvider router={router} />;
}