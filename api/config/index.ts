// src/api/index.ts
import axios from "axios";
import { apiConfig } from "./config";

console.log("Axios Base URL:", apiConfig.baseURL); // Debugging line

const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: apiConfig.headers,
});

export default apiClient;
