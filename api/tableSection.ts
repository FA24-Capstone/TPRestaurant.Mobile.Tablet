// src/api/tableSession.ts
import axios from "axios";
import {
  AddTableSessionRequest,
  AddTableSessionResponse,
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
