import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../AdminDashboard.css";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <header className="admin-navbar">
        <div className="admin-nav-brand">
          <Link to="/admin" className="admin-brand">Upskill_Resume Admin Portal</Link>
          <span className="admin-role-badge">Role: {user?.role || "ADMIN"}</span>
        </div>
        <div className="admin-nav-actions">
          <Link to="/" className="admin-platform-link">← Main Platform</Link>
          <button onClick={handleLogout} type="button" className="admin-logout-button">Logout</button>
        </div>
      </header>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}
