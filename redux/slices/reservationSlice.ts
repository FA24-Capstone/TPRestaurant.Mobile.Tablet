// src/redux/slices/reservationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReservationByPhoneApiResponse } from "@/app/types/reservation_type";

interface ReservationState {
  data: ReservationByPhoneApiResponse | null;
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
    fetchReservationStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchReservationSuccess(
      state,
      action: PayloadAction<ReservationByPhoneApiResponse>
    ) {
      state.isLoading = false;
      state.data = action.payload;
    },
    fetchReservationFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearReservationData(state) {
      state.data = null;
    },
  },
});

export const {
  fetchReservationStart,
  fetchReservationSuccess,
  fetchReservationFailure,
  clearReservationData,
} = reservationSlice.actions;

export default reservationSlice.reducer;
