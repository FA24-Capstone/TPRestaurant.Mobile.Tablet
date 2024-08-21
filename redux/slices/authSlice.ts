import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  deviceId: string | null;
  deviceCode: string | null;
  tableId: string | null;
  tableName: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  deviceId: null,
  deviceCode: null,
  tableId: null,
  tableName: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        token: string;
        deviceId: string;
        deviceCode: string;
        tableId: string;
        tableName: string;
      }>
    ) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.deviceId = action.payload.deviceId;
      state.deviceCode = action.payload.deviceCode;
      state.tableId = action.payload.tableId;
      state.tableName = action.payload.tableName;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.deviceId = null;
      state.deviceCode = null;
      state.tableId = null;
      state.tableName = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
