export const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_BASE_URL || "https://uniformpal-backend.onrender.com";
