// packages/admin/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

import ProductListPage from './pages/products/ProductListPage';
import ProductForm from './pages/products/ProductForm';
import ProductTrashPage from './pages/products/ProductTrashPage';
import CategoryListPage from './pages/categories/CategoryListPage';

// --- IMPORT CÁC TRANG USER ---
import UserListPage from './pages/users/UserListPage';
import UserFormPage from './pages/users/UserFormPage';
import UserTrashPage from './pages/users/UserTrashPage';

// --- IMPORT CÁC TRANG RESERVATION ---
import ReservationListPage from './pages/reservations/ReservationListPage';
import ReservationDetailPage from './pages/reservations/ReservationDetailPage';
import ReservationTrashPage from './pages/reservations/ReservationTrashPage';

// --- IMPORT CÁC TRANG ROLE/PERMISSION ---
import RoleListPage from './pages/roles/RoleListPage';
import AssignPermissionPage from './pages/roles/AssignPermissionPage';

// --- IMPORT TRANG TABLE ---
import TableListPage from './pages/tables/TableListPage';

function App() {
  return (
    <AntdApp>
      <BrowserRouter>
        <Routes>
          {/* Routes yêu cầu đăng nhập */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Sản phẩm */}
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />
              <Route path="/products/trash" element={<ProductTrashPage />} />

              {/* Danh mục */}
              <Route path="/categories" element={<CategoryListPage />} />

              {/* === THÊM ROUTES USER === */}
              <Route path="/users" element={<UserListPage />} />
              <Route path="/users/new" element={<UserFormPage />} />
              <Route path="/users/edit/:id" element={<UserFormPage />} />
              <Route path="/users/trash" element={<UserTrashPage />} />
              {/* ======================== */}

              {/* === THÊM ROUTES RESERVATION === */}
              <Route path="/reservations" element={<ReservationListPage />} />
              <Route path="/reservations/:id" element={<ReservationDetailPage />} />
              <Route path="/reservations/trash" element={<ReservationTrashPage />} />
              {/* ============================= */}

              {/* === THÊM ROUTES ROLE/PERMISSION === */}
              <Route path="/roles" element={<RoleListPage />} />
              <Route path="/roles/permissions" element={<AssignPermissionPage />} />
              {/* ================================ */}

              {/* === THÊM ROUTE TABLE === */}
              <Route path="/tables" element={<TableListPage />} />
              {/* ======================= */}

            </Route>
          </Route>

          {/* Routes công khai */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AntdApp>
  );
}

export default App;