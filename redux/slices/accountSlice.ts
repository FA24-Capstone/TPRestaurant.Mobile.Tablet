// src/redux/slices/accountSlice.ts
import { fetchAccountByPhoneNumber } from "@/api/reservationApi";
import { AccountApiResponse } from "@/app/types/reservation_type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AccountState {
  data: AccountApiResponse["result"] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  data: null,
  isLoading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearAccountData(state) {
      state.data = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountByPhoneNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAccountByPhoneNumber.fulfilled,
        (state, action: PayloadAction<AccountApiResponse>) => {
          state.isLoading = false;
          state.data = action.payload.result;
        }
      )
      .addCase(fetchAccountByPhoneNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAccountData } = accountSlice.actions;

export default accountSlice.reducer;
