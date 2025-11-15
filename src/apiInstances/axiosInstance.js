import axios from "axios";
import { BACKEND_BASE_URL } from "./baseurl";

const BACKEND_URL = BACKEND_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("🚀 ~ error:", error);
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.data?.message?.toLowerCase().includes("token"))
    ) {
      const errorResponse = {
        success: false,
        status: error.response.status,
        data: error.response.data, // Return API error response
      };
      localStorage.removeItem("auth_token");
      window.location.href = "/login"; // or use a redirect handler
      console.log("🚀 ~ errorResponse:", errorResponse);
      return Promise.reject(error);
    }
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
);

export default axiosInstance;
