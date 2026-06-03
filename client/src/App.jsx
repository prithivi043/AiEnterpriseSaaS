import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, RoleRoute } from "./components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/Unauthorized";

// Dashboards (role-specific)
import AdminDashboard from "./pages/admin/Dashboard";
import ManagerDashboard from "./pages/manager/Dashboard";
import EmployeeDashboard from "./pages/employee/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public ──────────────────────────────── */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ── Admin only ──────────────────────────── */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* ── Manager only ────────────────────────── */}
          <Route element={<RoleRoute allowedRoles={["manager"]} />}>
            <Route path="/manager" element={<ManagerDashboard />} />
          </Route>

          {/* ── Employee only ───────────────────────── */}
          <Route element={<RoleRoute allowedRoles={["employee"]} />}>
            <Route path="/employee" element={<EmployeeDashboard />} />
          </Route>

          {/* ── Fallback ────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
