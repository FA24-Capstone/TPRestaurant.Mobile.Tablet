import { ReservationApiResponse } from "@/app/types/reservation_type";
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
