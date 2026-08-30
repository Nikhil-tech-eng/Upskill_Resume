import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-wrapper" style={{ padding: "5rem 2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "4rem", color: "var(--accent-primary, #6366f1)", marginBottom: "1rem" }}>404</h1>
      <h2 style={{ color: "#ffffff", marginBottom: "1rem" }}>Page Not Found</h2>
      <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="back-btn-inline" style={{ display: "inline-block" }}>
        ← Back to Home
      </Link>
    </div>
  );
}
