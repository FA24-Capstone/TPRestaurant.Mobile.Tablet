import {
  ReservationApiResponse,
  ReservationByPhoneApiResponse,
} from "@/app/types/reservation_type";
import {
  fetchReservationFailure,
  fetchReservationStart,
  fetchReservationSuccess,
} from "@/redux/slices/reservationSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchReservationWithTime = async (
  tableId: string,
  time: string
): Promise<ReservationApiResponse> => {
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
  dispatch: AppDispatch,
  pageNumber: number = 1,
  pageSize: number = 10,
  phoneNumber: string = "",
  status: number = 1
): Promise<boolean> => {
  dispatch(fetchReservationStart());
  try {
    const response = await axios.get<ReservationByPhoneApiResponse>(
      `${API_URL}/reservation/get-all-reservation-by-phone-number/${pageNumber}/${pageSize}?phoneNumber=${phoneNumber}&status=${status}`,
      {
        params: { phoneNumber },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "API response for reservation by phone number:",
      JSON.stringify(response.data.result, null, 2)
    );

    if (response.data.isSuccess && response.data.result.items.length > 0) {
      dispatch(fetchReservationSuccess(response.data));
      return true;
    } else {
      dispatch(fetchReservationFailure("No reservations found."));
      return false;
    }
  } catch (error) {
    dispatch(
      fetchReservationFailure("Failed to fetch reservation by phone number.")
    );
    return false;
  }
};
