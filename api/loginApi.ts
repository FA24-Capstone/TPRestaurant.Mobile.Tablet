import { LoginResponse } from "@/app/types/login_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { login, logout } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import apiClient from "./config";
import moment from "moment-timezone";
import { fetchReservationWithTime } from "./reservationApi";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// ==================== Login Device ====================
export const loginDevice = async (
  deviceCode: string,
  password: string,
  rememberMe: boolean,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      `/device/login-device`,
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
      await SecureStore.setItemAsync("token", token);

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

      const now = moment()
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
      console.log("now", now);

      dispatch(
        fetchReservationWithTime({
          tableId: deviceResponse.tableId,
          time: now,
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
      if (error.response?.status === 401) {
        // Handle unauthorized error by logging out
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("deviceCode");
        await SecureStore.deleteItemAsync("password");
        await SecureStore.deleteItemAsync("rememberMe");

        dispatch(logout()); // Dispatch a logout action
        showErrorMessage("Session expired. Please log in again.");
        throw new Error("Session expired. Please log in again.");
      } else {
        const backendMessage =
          error.response?.data?.messages?.[0] ||
          "An error occurred during login.";
        showErrorMessage(backendMessage);
        throw new Error(backendMessage);
      }
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};
