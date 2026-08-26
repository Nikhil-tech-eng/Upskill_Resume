import { useState } from "react";
import { apiFetch } from "../api";

function Register() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleRegister = async (e) => {
e.preventDefault();

const response = await apiFetch("/api/users/register", {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
},
body: JSON.stringify({
    name,
    email,
    password,
}),
});

const data = await response.json();

if (response.ok) {
    alert("Registration successful!");
} else {
    alert(data.message || "Registration failed");
}
};

return (
<div className="auth-page">
    <form className="auth-card" onSubmit={handleRegister}>
    <h1>Create Account</h1>
    <p>Join Upskill_Resume</p>

    <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
    />

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

    <button type="submit" className="primary-btn">
        Register
    </button>
    </form>
</div>
);
}

export default Register;