import { useState } from "react";
import { apiFetch } from "../api";

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async (e) => {
e.preventDefault();

try {
    const response = await apiFetch("/api/users/login", {
    method: "POST",
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
    localStorage.setItem("token", data);

    if (localStorage.getItem("redirectAfterLogin") === "ats") {
        localStorage.removeItem("redirectAfterLogin");
        localStorage.setItem("openPage", "ats");
    } else {
        localStorage.removeItem("openPage");
    }

    window.location.reload();
    } else {
    alert(data || "Login failed");
    }

} catch (error) {
    console.error(error);
    alert("Something went wrong");
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

    <button
        type="submit"
        className="primary-btn"
    >
        Login
    </button>

    </form>

</div>
);
}

export default Login;