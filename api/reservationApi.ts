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
import apiClient from "./config";

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
      // Tạo một promise timeout để hủy yêu cầu sau 10 giây (10000 milliseconds)
      const timeoutPromise = new Promise<ReservationApiResponse>((_, reject) =>
        setTimeout(() => {
          reject("Request timed out. Please try again.");
        }, 10000)
      );

      // Kết hợp timeoutPromise với yêu cầu API để lấy dữ liệu
      const response = await Promise.race([
        apiClient.get<ReservationApiResponse>(
          `/order/get-table-reservation-with-time`,
          {
            params: { tableId, time },
          }
        ),
        timeoutPromise,
      ]);

      const data = (response as any).data; // Ép kiểu để sử dụng `data`
      console.log("responseReservationWithTime ", data);

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
