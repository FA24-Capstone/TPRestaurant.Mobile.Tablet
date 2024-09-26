import {
  ReservationApiResponse,
  ReservationByPhoneApiResponse,
} from "@/app/types/reservation_type";

import { AppDispatch } from "@/redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Tạo một async thunk để fetch reservation với thời gian
export const fetchReservationWithTime = createAsyncThunk<
  ReservationApiResponse,
  { tableId: string; time: string },
  { rejectValue: string }
>(
  "reservation/fetchReservationWithTime",
  async ({ tableId, time }, { rejectWithValue }) => {
    try {
      const response = await axios.get<ReservationApiResponse>(
        `${API_URL}/order/get-table-reservation-with-time`,
        {
          params: { tableId, time },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch reservation with time:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reservation"
      );
    }
  }
);
