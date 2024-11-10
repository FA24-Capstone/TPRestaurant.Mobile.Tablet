import {
  ReservationApiResponse,
  ReservationByPhoneApiResponse,
} from "@/app/types/reservation_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

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

      const data = response.data;

      // Check if the API call was successful
      if (data.isSuccess) {
        // showSuccessMessage("Reservation fetched successfully!");
        return data;
      } else {
        const errorMessage =
          data.messages?.[0] || "Failed to fetch reservation.";
        showErrorMessage(errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error: any) {
      console.error("Failed to fetch reservation with time:", error);
      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.messages?.[0] ||
          "An error occurred while fetching reservation.";
        showErrorMessage(backendMessage);
        return rejectWithValue(backendMessage);
      } else {
        showErrorMessage("An unexpected error occurred.");
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);
