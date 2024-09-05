// src/api/tableSession.ts
import axios from "axios";
import {
  AddPrelistTableSessionResponse,
  AddTableSessionRequest,
  AddTableSessionResponse,
  GetTableSessionResponse,
  PrelistOrderDto,
} from "@/app/types/tableSession_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const addTableSession = async (
  tableSessionData: AddTableSessionRequest
): Promise<AddTableSessionResponse> => {
  try {
    const response = await axios.post<AddTableSessionResponse>(
      `${API_URL}/table-session/add-table-session`,
      tableSessionData,
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

export const addNewPrelistOrder = async (orderData: {
  tableSessionId: string;
  orderTime: string;
  prelistOrderDtos: PrelistOrderDto[];
}): Promise<AddPrelistTableSessionResponse> => {
  try {
    const response = await axios.post<AddPrelistTableSessionResponse>(
      `${API_URL}/table-session/add-new-prelist-order`,
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

export const fetchTableSessionById = async (
  tableSessionId: string
): Promise<GetTableSessionResponse> => {
  try {
    const response = await axios.get<GetTableSessionResponse>(
      `${API_URL}/table-session/get-table-session-by-id/${tableSessionId}`,
      { headers: { "Content-Type": "application/json" } }
    );
    // Log detailed response for debugging
    console.log(
      "API response for TableSessionById:",
      JSON.stringify(response.data.result, null, 2)
    );
    // Return the response directly if it matches the expected shape
    return response.data;
  } catch (error) {
    // Log and rethrow the error to handle it in the caller function or middleware
    console.error("Failed to fetch combo details:", error);
    throw error;
  }
};
