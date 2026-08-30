import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedAdminRoute({ children }) {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "ADMIN") {
    return (
      <div className="page-wrapper" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-main, #ffffff)" }}>
        <h2 style={{ color: "#ef4444", marginBottom: "1rem" }}>Access Denied</h2>
        <p style={{ marginBottom: "2rem", color: "#94a3b8" }}>
          You do not have administrative privileges to access this page.
        </p>
        <a href="/" className="back-btn-inline" style={{ display: "inline-block" }}>
          ← Return to Home
        </a>
      </div>
    );
  }

  return children;
}
