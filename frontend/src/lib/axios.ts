import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL: "http://localhost:5000/api",
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api/main" : "/api/main",
})