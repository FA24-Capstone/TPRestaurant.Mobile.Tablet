// src/api/tableSession.ts
import axios from "axios";
import {
  AddPrelistTableSessionReponse,
  AddPrelistTableSessionRequest,
  AddTableSessionRequest,
  AddTableSessionResponse,
  GetTableSessionResponse,
  PrelistOrderDto,
} from "@/app/types/tableSession_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ==================== Add Table Session ====================
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

    const data = response.data;

    // Check if the API call was successful
    if (data.isSuccess) {
      showSuccessMessage("Table session added successfully!");
      return data;
    } else {
      const errorMessage = data.messages?.[0] || "Failed to add table session.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error("Failed to add table session:", error);
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while adding the table session.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// ==================== Add New Prelist Order ====================
export const addNewPrelistOrder = async (
  orderData: AddPrelistTableSessionRequest
): Promise<AddPrelistTableSessionReponse> => {
  try {
    const response = await axios.post<AddPrelistTableSessionReponse>(
      `${API_URL}/table-session/add-new-prelist-order`,
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
      showSuccessMessage("Prelist order added successfully!");
      return data;
    } else {
      const errorMessage = data.messages?.[0] || "Failed to add prelist order.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error("Failed to add prelist order:", error);
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while adding the prelist order.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// ==================== Fetch Table Session By ID ====================
export const fetchTableSessionById = async (
  tableSessionId: string
): Promise<GetTableSessionResponse> => {
  try {
    const response = await axios.get<GetTableSessionResponse>(
      `${API_URL}/table-session/get-table-session-by-id/${tableSessionId}`,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response.data;

    // Check if the API call was successful
    if (data.isSuccess) {
      showSuccessMessage("Table session fetched successfully!");
      // Log detailed response for debugging
      console.log(
        "API response for TableSessionById:",
        JSON.stringify(data.result, null, 2)
      );
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to fetch table session.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error("Failed to fetch table session:", error);
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while fetching the table session.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};
