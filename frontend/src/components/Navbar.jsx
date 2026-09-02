import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogoutClick = () => {
    closeMobileMenu();
    logout();
    navigate("/");
  };

  const getNavLinkClass = ({ isActive }) => (isActive ? "nav-active" : "");
  const getMobileNavLinkClass = ({ isActive }) =>
    `mobile-nav-link ${isActive ? "nav-active" : ""}`;

  return (
    <header className="global-navbar-container">
      <nav className="landing-navbar">
        <Link
          to="/"
          className="landing-logo navbar-brand-btn"
          onClick={closeMobileMenu}
          aria-label="Upskill Resume home"
        >
          <span className="brand-mark">U</span>
          <span className="brand-wordmark">
            <span className="brand-primary">Upskill</span>
            <span className="brand-accent">_Resume</span>
          </span>
        </Link>

        <div className="landing-nav-links">
          <NavLink to="/" end className={getNavLinkClass}>
            Home
          </NavLink>

          <NavLink to="/resume-builder" className={getNavLinkClass}>
            Create Resume
          </NavLink>

          <NavLink to="/resume-analysis" className={getNavLinkClass}>
            Resume Analysis
          </NavLink>

          <NavLink to="/job-matching" className={getNavLinkClass}>
            Job Matching
          </NavLink>

          <NavLink to="/interview-preparation" className={getNavLinkClass}>
            Interview Preparation
          </NavLink>

          <NavLink to="/learning-resources" className={getNavLinkClass}>
            Learning Resources
          </NavLink>

          <NavLink to="/about-us" className={getNavLinkClass}>
            About Us
          </NavLink>

          <NavLink to="/contact" className={getNavLinkClass}>
            Contact
          </NavLink>

          {role === "ADMIN" && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `admin-link ${getNavLinkClass({ isActive })}`}
            >
              Admin
            </NavLink>
          )}
        </div>

        <div className="landing-auth">
          {isLoggedIn ? (
            <button
              type="button"
              className="login-nav-btn logout-btn"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className={`login-nav-btn ${location.pathname === "/login" ? "auth-active-btn" : ""}`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className={`register-nav-btn ${location.pathname === "/register" ? "auth-active-btn" : ""}`}
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <span className="close-icon">✕</span>
          ) : (
            <span className="hamburger-icon">☰</span>
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <NavLink to="/" end className={getMobileNavLinkClass} onClick={closeMobileMenu}>
            Home
          </NavLink>

          <NavLink to="/resume-builder" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
            Create Resume
          </NavLink>

          <NavLink to="/resume-analysis" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
            Resume Analysis
          </NavLink>

          <NavLink to="/job-matching" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
            Job Matching
          </NavLink>

          <NavLink to="/interview-preparation" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
            Interview Preparation
          </NavLink>

          <NavLink to="/learning-resources" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
            Learning Resources
          </NavLink>

          <NavLink to="/about-us" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
            About Us
          </NavLink>

          <NavLink to="/contact" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
            Contact
          </NavLink>

          {role === "ADMIN" && (
            <NavLink to="/admin" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
              Admin
            </NavLink>
          )}

          <div className="mobile-auth-divider" />

          <div className="mobile-auth-actions">
            {isLoggedIn ? (
              <button
                type="button"
                className="mobile-auth-btn mobile-logout-btn"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-auth-btn mobile-login-btn"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="mobile-auth-btn mobile-register-btn"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
