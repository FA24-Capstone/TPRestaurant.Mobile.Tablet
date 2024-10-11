// src/redux/slices/reservationSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReservationApiResponse } from "@/app/types/reservation_type";
import { fetchReservationWithTime } from "@/api/reservationApi";

interface ReservationState {
  data: ReservationApiResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  data: null,
  isLoading: false,
  error: null,
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    clearReservationData(state) {
      state.data = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservationWithTime.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchReservationWithTime.fulfilled,
        (state, action: PayloadAction<ReservationApiResponse>) => {
          state.isLoading = false;
          // Check if the result is null, and clear data if true
          state.data = action.payload.result ? action.payload : null;
        }
      )
      .addCase(fetchReservationWithTime.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});
export const { clearReservationData } = reservationSlice.actions;

export default reservationSlice.reducer;
