// src/api/ordersApi.ts
import apiClient from "./config/index";

export const fetchOrders = async () => {
  try {
    const response = await apiClient.get("/orders");
    return response.data;
  } catch (error) {
    throw error;
  }
};
