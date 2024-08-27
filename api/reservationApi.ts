import {
  ReservationApiResponse,
  ReservationByPhoneApiResponse,
} from "@/app/types/reservation_type";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchReservationWithTime = async (
  tableId: string,
  time: string
): Promise<ReservationApiResponse> => {
  try {
    const response = await axios.get<ReservationApiResponse>(
      `${API_URL}/reservation/get-table-reservation-with-time`,
      {
        params: { tableId, time },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Log detailed response for debugging
    console.log(
      "API response for reservation with time:",
      JSON.stringify(response.data.result, null, 2)
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch reservation with time:", error);
    throw error;
  }
};

export const fetchReservationByPhone = async (
  pageNumber: number = 1,
  pageSize: number = 6,
  phoneNumber: string = ""
): Promise<boolean> => {
  try {
    const response = await axios.get<ReservationByPhoneApiResponse>(
      `${API_URL}/reservation/get-all-reservation-by-phone-number/${pageNumber}/${pageSize}?phoneNumber=${phoneNumber}`,
      {
        params: { phoneNumber },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Log response for debugging
    console.log(
      "API response for reservation by phone number:",
      JSON.stringify(response.data.result, null, 2)
    );

    // Check if the request was successful and items array is not empty
    return response.data.isSuccess && response.data.result.items.length > 0;
  } catch (error) {
    console.error("Failed to fetch reservation by phone number:", error);
    return false;
  }
};
