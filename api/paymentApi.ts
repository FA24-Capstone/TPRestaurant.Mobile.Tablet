// src/api/paymentApi.ts
import axios from "axios";
import {
  CreatePaymentResponse,
  CreatePaymentRequest,
  PaymentDetailReponse,
} from "@/app/types/payment_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ==================== Create Payment ====================
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

    const data = response.data;

    // Check if the API call was successful
    if (data.isSuccess) {
      showSuccessMessage("Payment created successfully!");
      console.log("createPaymentResponse", JSON.stringify(data, null, 2));
      return data;
    } else {
      const errorMessage = data.messages?.[0] || "Failed to create payment.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while creating the payment.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// New getPaymentById function
export const getPaymentById = async (
  paymentId: string
): Promise<PaymentDetailReponse> => {
  try {
    console.log("Fetching payment with ID:", paymentId);

    const response = await axios.get<PaymentDetailReponse>(
      `${API_URL}/transaction/get-payment-by-id/${paymentId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Check if the API call was successful
    if (data.isSuccess) {
      console.log("getPaymentByIdResponse", JSON.stringify(data, null, 2));
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to retrieve payment details.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while fetching the payment details.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};
