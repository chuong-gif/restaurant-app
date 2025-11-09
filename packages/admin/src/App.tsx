// packages/admin/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Đã sửa ở các bước trước

// Import các trang
import ProductListPage from './pages/products/ProductListPage';
import ProductForm from './pages/products/ProductForm';
import ProductTrashPage from './pages/products/ProductTrashPage';
import CategoryListPage from './pages/categories/CategoryListPage';
import UserListPage from './pages/users/UserListPage';
import UserFormPage from './pages/users/UserFormPage';
import UserTrashPage from './pages/users/UserTrashPage';
import ReservationListPage from './pages/reservations/ReservationListPage';
import ReservationDetailPage from './pages/reservations/ReservationDetailPage';
import ReservationTrashPage from './pages/reservations/ReservationTrashPage';
import RoleListPage from './pages/roles/RoleListPage';
import AssignPermissionPage from './pages/roles/AssignPermissionPage';
import TableListPage from './pages/tables/TableListPage';
import PromotionListPage from './pages/promotions/PromotionListPage';
import BlogCategoryListPage from './pages/blogCategories/BlogCategoryListPage';
import BlogListPage from './pages/blogs/BlogListPage';
import BlogFormPage from './pages/blogs/BlogFormPage';
import BlogCommentsPage from './pages/blogs/BlogCommentsPage';

function App() {
  return (
    <AntdApp>
      <BrowserRouter>
        <Routes>
          {/* 1. Routes công khai (Đăng nhập) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* 2. Routes yêu cầu đăng nhập */}
          <Route element={<AdminLayout />}>
            {/* Dashboard: Chỉ cần đăng nhập */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* --- Sản phẩm --- */}
            <Route element={<ProtectedRoute requiredPermission="view_product" />}>
              <Route path="/products" element={<ProductListPage />} />
            </Route>
            <Route element={<ProtectedRoute requiredPermission="add_product" />}>
              <Route path="/products/new" element={<ProductForm />} />
            </Route>
            <Route element={<ProtectedRoute requiredPermission="edit_product" />}>
              <Route path="/products/edit/:id" element={<ProductForm />} />
            </Route>
            <Route element={<ProtectedRoute requiredPermission="view_product_trash" />}>
              <Route path="/products/trash" element={<ProductTrashPage />} />
            </Route>

            {/* --- Danh mục --- */}
            <Route element={<ProtectedRoute requiredPermission="view_product_category" />}>
              <Route path="/categories" element={<CategoryListPage />} />
            </Route>

            {/* --- Người dùng --- */}
            <Route element={<ProtectedRoute requiredPermission="view_user" />}>
              <Route path="/users" element={<UserListPage />} />
            </Route>
            <Route element={<ProtectedRoute requiredPermission="add_user" />}>
              <Route path="/users/new" element={<UserFormPage />} />
            </Route>
            <Route element={<ProtectedRoute requiredPermission="edit_user" />}>
              <Route path="/users/edit/:id" element={<UserFormPage />} />
            </Route>
            <Route element={<ProtectedRoute requiredPermission="view_user_trash" />}>
              <Route path="/users/trash" element={<UserTrashPage />} />
            </Route>

            {/* --- Đặt bàn --- */}
            <Route element={<ProtectedRoute requiredPermission="view_reservation" />}>
              <Route path="/reservations" element={<ReservationListPage />} />
              <Route path="/reservations/:id" element={<ReservationDetailPage />} />
            </Route>
            <Route element={<ProtectedRoute requiredPermission="view_reservation_trash" />}>
              <Route path="/reservations/trash" element={<ReservationTrashPage />} />
            </Route>

            {/* --- Vai trò & Quyền --- */}
            <Route element={<ProtectedRoute requiredPermission="view_role" />}>
              <Route path="/roles" element={<RoleListPage />} />
            </Route>
            <Route element={<ProtectedRoute requiredPermission="assign_permission" />}>
              <Route path="/roles/permissions" element={<AssignPermissionPage />} />
            </Route>

            {/* --- Bàn ăn --- */}
            <Route element={<ProtectedRoute requiredPermission="view_table" />}>
              <Route path="/tables" element={<TableListPage />} />
            </Route>

            {/* --- Khuyến mãi --- */}
            <Route element={<ProtectedRoute requiredPermission="view_promotion" />}>
              <Route path="/promotions" element={<PromotionListPage />} />
            </Route>

            {/* --- Blog (Tạm thời chỉ cần đăng nhập, vì CSDL chưa có mã quyền cho Blog) --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/blog-categories" element={<BlogCategoryListPage />} />
              <Route path="/blogs" element={<BlogListPage />} />
              <Route path="/blogs/new" element={<BlogFormPage />} />
              <Route path="/blogs/edit/:id" element={<BlogFormPage />} />
            </Route>
            <Route element={<ProtectedRoute requiredPermission="view_blog_comments" />}>
              <Route path="/blog-comments/:blogId" element={<BlogCommentsPage />} />
            </Route>
          </Route>


          {/* 3. Route mặc định: Chuyển hướng về dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AntdApp>
  );
}

export default App;