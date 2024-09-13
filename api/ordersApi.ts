// src/api/ordersApi.ts
import { OrderReponse, OrderRequest } from "@/app/types/order_type";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const createOrderinTablet = async (
  orderRequest: OrderRequest
): Promise<OrderReponse> => {
  try {
    const response = await axios.post<OrderReponse>(
      `${API_URL}/order/create-order`,
      orderRequest,
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
