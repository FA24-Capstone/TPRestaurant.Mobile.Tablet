// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Thêm từ khóa 'export' để xuất interface AuthState
export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  deviceId: string | null;
  deviceCode: string | null;
  tableId: string | null;
  tableName: string | null;
  mainRole: string | null; // Thêm thuộc tính này để giữ mainRole
  rememberMe: boolean; // Thêm thuộc tính này để giữ rememberMe (không cần dấu '?')
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  deviceId: null,
  deviceCode: null,
  tableId: null,
  tableName: null,
  mainRole: null,
  rememberMe: false, // Thiết lập mặc định
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        token: string;
        deviceResponse: {
          deviceId: string;
          deviceCode: string;
          tableId: string;
          tableName: string;
          mainRole: string;
        };
        rememberMe: boolean; // Thêm rememberMe vào payload
      }>
    ) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.deviceId = action.payload.deviceResponse.deviceId;
      state.deviceCode = action.payload.deviceResponse.deviceCode;
      state.tableId = action.payload.deviceResponse.tableId;
      state.tableName = action.payload.deviceResponse.tableName;
      state.mainRole = action.payload.deviceResponse.mainRole;
      state.rememberMe = action.payload.rememberMe; // Cập nhật rememberMe
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.deviceId = null;
      state.deviceCode = null;
      state.tableId = null;
      state.tableName = null;
      state.mainRole = null;
      state.rememberMe = false; // Reset rememberMe khi logout
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
