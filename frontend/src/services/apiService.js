import axios from "axios";

// ======================================================
// API Base URL
// ======================================================

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

// ======================================================
// Axios Instance
// ======================================================

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // 2 minutes for long scan operations
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// Request Interceptor
// ======================================================

api.interceptors.request.use(
  (config) => {
    // Future Authentication
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================================
// Response Interceptor
// ======================================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data?.message || error.response.data
      );
    } else if (error.request) {
      console.error("Backend server is not responding.");
    } else {
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// ======================================================
// Export
// ======================================================

export default api;