// src/api/ordersApi.ts
import {
  AddOrderReponse,
  AddOrderRequest,
  GetHistoryOrderIdReponse,
  CreateOrderReponse,
  OrderRequest,
} from "@/app/types/order_type";
import { GetTableSessionResponse } from "@/app/types/tableSession_type";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const createOrderinTablet = async (
  orderRequest: OrderRequest
): Promise<CreateOrderReponse> => {
  try {
    const response = await axios.post<CreateOrderReponse>(
      `${API_URL}/order/create-order`,
      orderRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("createOrderDataNe", JSON.stringify(response, null, 2));

    return response.data;
  } catch (error) {
    console.error("Failed to add table session:", error);
    throw error;
  }
};

export const addPrelistOrder = async (
  orderData: AddOrderRequest,
  orderId: string
): Promise<AddOrderReponse> => {
  try {
    console.log("orderDataNe", orderData);

    const response = await axios.post<AddOrderReponse>(
      `${API_URL}/order/add-dish-to-order/${orderId}`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to add table session:", error);
    throw error;
  }
};

export const getHistoryOrderId = async (
  orderId: string
): Promise<GetHistoryOrderIdReponse> => {
  console.log("orderIdNe", orderId);

  try {
    const response = await axios.get<GetHistoryOrderIdReponse>(
      `${API_URL}/order/get-order-detail/${orderId}`,
      { headers: { "Content-Type": "application/json" } }
    );
    // Log detailed response for debugging
    console.log(
      "API response for getHistoryOrderId:",
      JSON.stringify(response.data.result, null, 2)
    );
    // Return the entire response data to match the expected shape
    return response.data;
  } catch (error) {
    // Log and rethrow the error to handle it in the caller function or middleware
    console.error("Failed to getHistoryOrderId:", error);
    throw error;
  }
};
