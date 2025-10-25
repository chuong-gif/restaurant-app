// packages/admin/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntdApp } from 'antd'; // <-- THÊM DÒNG NÀY
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

import ProductListPage from './pages/products/ProductListPage';
import ProductForm from './pages/products/ProductForm';
import ProductTrashPage from './pages/products/ProductTrashPage';
import CategoryListPage from './pages/categories/CategoryListPage';

function App() {
  return (
    // BỌC MỌI THỨ BÊN TRONG <AntdApp> ĐỂ CÓ CONTEXT
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
            </Route>
          </Route>

          {/* Routes công khai */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AntdApp> // <-- ĐÓNG THẺ
  );
}

export default App;