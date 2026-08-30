import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiFetch("/api/users/login", {
        method: "POST",
        skipAuth: true,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.text();

      if (response.ok) {
        login(data);
        const from = location.state?.from?.pathname;
        const savedRedirect = localStorage.getItem("redirectAfterLogin");
        let target = from || "/";

        if (savedRedirect === "ats") {
          localStorage.removeItem("redirectAfterLogin");
          target = "/resume-analysis";
        }

        navigate(target, { replace: true });
      } else {
        alert(data || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1>Welcome Back</h1>
        <p>Login to Upskill_Resume</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-switch-prompt">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-link-btn" style={{ textDecoration: "none" }}>
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
