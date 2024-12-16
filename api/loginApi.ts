import { LoginResponse } from "@/app/types/login_type";
import { login } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
console.log("API_URL", API_URL);
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
    console.log("token1", token);
    await AsyncStorage.setItem("token", token);

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
      // await AsyncStorage.setItem("token", token);
      // Lưu deviceCode và password vào SecureStore
      await AsyncStorage.setItem("deviceCode", deviceCode);
      await AsyncStorage.setItem("password", password);
      // Lưu rememberMe vào SecureStore
      await AsyncStorage.setItem("rememberMe", "true");
    } else {
      // Đảm bảo không lưu token và xóa các thông tin đăng nhập
      await AsyncStorage.removeItem("deviceCode");
      await AsyncStorage.removeItem("password");
      await AsyncStorage.removeItem("rememberMe");
    }
    console.log("token2", await AsyncStorage.getItem("token"));
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
