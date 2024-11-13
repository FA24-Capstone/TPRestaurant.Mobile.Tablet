// src/api/ordersApi.ts
import { AppActionResult } from "@/app/types/app_action_result_type";
import {
  AddOrderReponse,
  AddOrderRequest,
  GetHistoryOrderIdReponse,
  CreateOrderReponse,
  OrderRequest,
  CreateOrderData,
  OrderHistoryData,
} from "@/app/types/order_type";
import { GetTableSessionResponse } from "@/app/types/tableSession_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import axios from "axios";
import apiClient from "./config";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ==================== Create Order in Tablet ====================

export const createOrderinTablet = async (
  orderRequest: OrderRequest
): Promise<AppActionResult<CreateOrderData>> => {
  const response = await apiClient.post<AppActionResult<CreateOrderData>>(
    `/order/create-order`,
    orderRequest
  );

  return response.data; // Return the AppActionResult data as is
};

// ==================== Add Prelist Order ====================

export const addPrelistOrder = async (
  orderData: AddOrderRequest,
  orderId: string
): Promise<AppActionResult<string>> => {
  const response = await apiClient.post<AppActionResult<string>>(
    `/order/add-dish-to-order/${orderId}`,
    orderData
  );

  return response.data; // Return the AppActionResult data as is
};

// ==================== Get History Order by ID ====================

export const getHistoryOrderId = async (
  orderId: string
): Promise<AppActionResult<OrderHistoryData>> => {
  const response = await apiClient.get<AppActionResult<OrderHistoryData>>(
    `/order/get-order-detail/${orderId}`
  );

  return response.data; // Return the AppActionResult data as is
};
