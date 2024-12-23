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
  console.log("orderRequest", JSON.stringify(orderRequest));

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

// ==================== Update Order Status ====================

export const updateOrderStatus = async (
  orderId: string,
  isSuccessful: boolean,
  status: number,
  asCustomer: boolean
): Promise<AppActionResult<null>> => {
  const response = await apiClient.put<AppActionResult<null>>(
    `/order/update-order-status/${orderId}`,
    null, // No body is required for this request
    {
      params: {
        isSuccessful,
        status,
        asCustomer,
      },
    }
  );
  return response.data;
};

// ==================== Get Table Session ====================

export const cancelOrderDetailsBeforeCooking = async (
  orderDetailsIds: string[]
): Promise<AppActionResult<null>> => {
  const response = await apiClient.put<AppActionResult<null>>(
    `/order/cancel-order-detail-before-cooking`,
    orderDetailsIds
  );
  return response.data;
};
