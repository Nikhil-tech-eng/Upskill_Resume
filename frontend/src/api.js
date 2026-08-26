const API_BASE_URL = "http://localhost:8080";

export const apiFetch = async (endpoint, options = {}) => {
const token = localStorage.getItem("token");

const headers = {
...options.headers,
};

if (token) {
headers.Authorization = `Bearer ${token}`;
}

return fetch(`${API_BASE_URL}${endpoint}`, {
...options,
headers,
});
};