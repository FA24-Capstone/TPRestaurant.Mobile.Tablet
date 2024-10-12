// src/api/paymentApi.ts
import axios from "axios";
import {
  CreatePaymentResponse,
  CreatePaymentRequest,
} from "@/app/types/payment_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const createPayment = async (
  paymentRequest: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  try {
    console.log("paymentRequest", paymentRequest);

    const response = await axios.post<CreatePaymentResponse>(
      `${API_URL}/transaction/create-payment`,
      paymentRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Logging the response for debugging purposes
    console.log(
      "createPaymentResponse",
      JSON.stringify(response.data, null, 2)
    );

    return response.data;
  } catch (error) {
    console.error("Failed to create payment:", error);
    throw error;
  }
};
