import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const normalizeRole = (role) => {
  const normalized = (role || "USER").toString().trim().toUpperCase();
  return normalized.startsWith("ROLE_") ? normalized.replace(/^ROLE_/, "") : normalized;
};

const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
};

const getUserFromToken = (tokenStr) => {
  const payload = parseJwt(tokenStr);
  return payload ? { email: payload.sub, role: normalizeRole(payload.role || "USER") } : null;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const user = getUserFromToken(token);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("openPage");
    localStorage.removeItem("currentPage");
    localStorage.removeItem("redirectAfterLogin");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, role: user?.role || null, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
