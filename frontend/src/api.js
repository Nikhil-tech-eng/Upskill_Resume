const API_BASE_URL = "http://localhost:8080";

export const apiFetch = async (endpoint, options = {}) => {
const { skipAuth = false, ...fetchOptions } = options;
const token = localStorage.getItem("token");

const headers = {
...fetchOptions.headers,
};

if (token && !skipAuth) {
headers.Authorization = `Bearer ${token}`;
}

return fetch(`${API_BASE_URL}${endpoint}`, {
...fetchOptions,
headers,
});
};

export const deleteResume = async (resumeId) => {
  return apiFetch(`/api/resumes/${resumeId}`, {
    method: "DELETE",
  });
};
