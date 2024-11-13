// src/api/paymentApi.ts
import axios from "axios";
import {
  CreatePaymentResponse,
  CreatePaymentRequest,
  PaymentDetailReponse,
  PaymentDetailReult,
} from "@/app/types/payment_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { AppActionResult } from "@/app/types/app_action_result_type";
import apiClient from "./config";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ==================== Create Payment ====================

export const createPayment = async (
  paymentRequest: CreatePaymentRequest
): Promise<AppActionResult<any>> => {
  const response = await apiClient.post<AppActionResult<any>>(
    `/transaction/create-payment`,
    paymentRequest
  );

  return response.data; // Return the AppActionResult data as is
};

// ==================== Get Payment by ID ====================
export const getPaymentById = async (
  paymentId: string
): Promise<AppActionResult<PaymentDetailReult>> => {
  const response = await apiClient.get<AppActionResult<PaymentDetailReult>>(
    `/transaction/get-payment-by-id/${paymentId}`
  );

  return response.data; // Return the AppActionResult data as is
};
