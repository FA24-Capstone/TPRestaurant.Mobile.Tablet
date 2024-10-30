import { LoginResponse } from "@/app/types/login_type";
import { login } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

// Định nghĩa hàm loginDevice với thứ tự tham số đúng
export const loginDevice = async (
  deviceCode: string,
  password: string,
  rememberMe: boolean, // Thêm rememberMe vào tham số
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

    const { token, deviceResponse } = response.data.result;

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
        rememberMe, // Thêm rememberMe vào payload
      })
    );

    if (rememberMe) {
      // Lưu token vào SecureStore nếu nhớ tài khoản
      await SecureStore.setItemAsync("token", token);
      // Lưu deviceCode và password vào SecureStore
      await SecureStore.setItemAsync("deviceCode", deviceCode);
      await SecureStore.setItemAsync("password", password);
      // Lưu rememberMe vào SecureStore
      await SecureStore.setItemAsync("rememberMe", "true");
    } else {
      // Đảm bảo không lưu token và xóa các thông tin đăng nhập
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("deviceCode");
      await SecureStore.deleteItemAsync("password");
      await SecureStore.deleteItemAsync("rememberMe");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
