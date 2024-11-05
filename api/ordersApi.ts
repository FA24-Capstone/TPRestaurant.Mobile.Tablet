// src/api/ordersApi.ts
import {
  AddOrderReponse,
  AddOrderRequest,
  GetHistoryOrderIdReponse,
  CreateOrderReponse,
  OrderRequest,
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
): Promise<CreateOrderReponse> => {
  try {
    console.log("orderRequestCreateOrder", orderRequest);

    const response = await axios.post<CreateOrderReponse>(
      `${API_URL}/order/create-order`,
      orderRequest,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Check if the API call was successful
    if (data.isSuccess) {
      showSuccessMessage("Order created successfully!");
      // Log for debugging
      console.log("createOrderDataNe", JSON.stringify(data, null, 2));
      return data;
    } else {
      const errorMessage = data.messages?.[0] || "Failed to create order.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error("Failed to create order:", error);
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while creating the order.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// ==================== Add Prelist Order ====================
export const addPrelistOrder = async (
  orderData: AddOrderRequest,
  orderId: string
): Promise<AddOrderReponse> => {
  try {
    console.log("orderDataNeaddPrelistOrder", orderId, orderData);

    const response = await axios.post<AddOrderReponse>(
      `${API_URL}/order/add-dish-to-order/${orderId}`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Check if the API call was successful
    if (data.isSuccess) {
      showSuccessMessage("Dishes added to order successfully!");
      console.log("addPrelistOrderDataNe", JSON.stringify(data, null, 2));
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to add dishes to order.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error("Failed to add prelist order:", error);
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while adding dishes to the order.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// ==================== Get History Order by ID ====================
export const getHistoryOrderId = async (
  orderId: string
): Promise<GetHistoryOrderIdReponse> => {
  try {
    console.log("Fetching order history for ID:", orderId);

    const response = await axios.get<GetHistoryOrderIdReponse>(
      `${API_URL}/order/get-order-detail/${orderId}`,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;

    // Check if the API call was successful
    if (data.isSuccess) {
      // showSuccessMessage("Order history retrieved successfully!");
      console.log(
        "API response for getHistoryOrderId:",
        JSON.stringify(data.result, null, 2)
      );
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to fetch order history.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error("Failed to get history order ID:", error);
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while fetching the order history.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};
