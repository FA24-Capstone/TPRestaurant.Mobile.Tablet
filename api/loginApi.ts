import { LoginResponse } from "@/app/types/login_type";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// Create the login function
export const loginDevice = async (
  deviceCode: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/device/login-device`,
      {
        deviceCode,
        password,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Login error:", error); // Log detailed error
    throw error;
  }
};
