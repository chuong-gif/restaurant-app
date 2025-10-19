import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardPage from "@/pages/Dashboard";
import CustomersPage from "@/pages/Customers";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow">
        <Header />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomersPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
export default App;