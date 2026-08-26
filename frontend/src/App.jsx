import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState(
    localStorage.getItem("token") ? "dashboard" : "home"
  );

  if (page === "login") {
    return (
      <>
        <button className="back-btn" onClick={() => setPage("home")}>
          ← Back
        </button>
        <Login />
      </>
    );
  }

  if (page === "register") {
    return (
      <>
        <button className="back-btn" onClick={() => setPage("home")}>
          ← Back
        </button>
        <Register />
      </>
    );
  }

  if (page === "dashboard") {
    return <Dashboard />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h2>Upskill_Resume</h2>

        <div className="nav-links">
          <button onClick={() => setPage("login")}>Login</button>

          <button
            className="register-btn"
            onClick={() => setPage("register")}
          >
            Register
          </button>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <h1>
            Build a Better Resume.
            <br />
            Get Hired Faster.
          </h1>

          <p>
            Upload your resume, get AI-powered ATS analysis,
            discover skill gaps, and prepare for your next interview.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => setPage("register")}
            >
              Get Started
            </button>

            <button
              className="secondary-btn"
              onClick={() => setPage("login")}
            >
              Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;