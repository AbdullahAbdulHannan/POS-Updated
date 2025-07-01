import "antd/dist/antd.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserDash from "./pages/UserDash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import SuperadminDashboard from "./pages/SuperadminDashboard";
import { useEffect } from "react";
import { checkTokenExpiry } from "./utils/checkTokenExpiry";
import HomePage from "./pages/HomePage";
import PaymentSuccess from "./pages/PaymentSucces";
import Hold from "./pages/Hold";

function App() {
  useEffect(() => {
    checkTokenExpiry();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/user/*"
            element={
              <ProtectedRoute allowedRole="user">
                <UserDash />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/*"
            element={
              <ProtectedRoute allowedRole="superadmin">
                <SuperadminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/hold" element={<Hold />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
export function ProtectedRoute({ allowedRole, children }) {
  const authData = JSON.parse(localStorage.getItem("auth"));

  if (!authData) return <Navigate to="/login" />;

  // Check if user has correct role
  if (authData.role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  // Check for subscription expiry (only for admin or user)
  if ((allowedRole === "admin" || allowedRole === "user") && authData.subscriptionExpired) {
    return <Navigate to="/hold" />;
  }

  return children;
}
