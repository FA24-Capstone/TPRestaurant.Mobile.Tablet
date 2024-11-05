import { LoginResponse } from "@/app/types/login_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { login } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// ==================== Login Device ====================
export const loginDevice = async (
  deviceCode: string,
  password: string,
  rememberMe: boolean,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/device/login-device`,
      {
        deviceCode,
        password,
      }
    );

    const data = response.data;

    // Check if the API call was successful
    if (data.isSuccess) {
      showSuccessMessage("Login successful!");

      const { token, deviceResponse } = data.result;

      // Dispatch to Redux store
      dispatch(
        login({
          token,
          deviceResponse: {
            deviceId: deviceResponse.deviceId,
            deviceCode: deviceResponse.deviceCode,
            tableId: deviceResponse.tableId,
            tableName: deviceResponse.tableName,
            mainRole: deviceResponse.mainRole,
          },
          rememberMe,
        })
      );

      if (rememberMe) {
        // Store credentials securely if 'rememberMe' is true
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("deviceCode", deviceCode);
        await SecureStore.setItemAsync("password", password);
        await SecureStore.setItemAsync("rememberMe", "true");
      } else {
        // Remove stored credentials if 'rememberMe' is false
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("deviceCode");
        await SecureStore.deleteItemAsync("password");
        await SecureStore.deleteItemAsync("rememberMe");
      }
    } else {
      const errorMessage = data.messages?.[0] || "Login failed.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error("Login error:", error);
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred during login.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};
