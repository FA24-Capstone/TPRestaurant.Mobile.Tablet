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

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ==================== Create Order in Tablet ====================

export const createOrderinTablet = async (
  orderRequest: OrderRequest
): Promise<AppActionResult<CreateOrderData>> => {
  const response = await axios.post<AppActionResult<CreateOrderData>>(
    `${API_URL}/order/create-order`,
    orderRequest,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data; // Return the AppActionResult data as is
};

// ==================== Add Prelist Order ====================

export const addPrelistOrder = async (
  orderData: AddOrderRequest,
  orderId: string
): Promise<AppActionResult<string>> => {
  const response = await axios.post<AppActionResult<string>>(
    `${API_URL}/order/add-dish-to-order/${orderId}`,
    orderData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data; // Return the AppActionResult data as is
};

// ==================== Get History Order by ID ====================

export const getHistoryOrderId = async (
  orderId: string
): Promise<AppActionResult<OrderHistoryData>> => {
  const response = await axios.get<AppActionResult<OrderHistoryData>>(
    `${API_URL}/order/get-order-detail/${orderId}`,
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data; // Return the AppActionResult data as is
};
