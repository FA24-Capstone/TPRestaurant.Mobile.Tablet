import axios from "axios";
import {
  Combo,
  ComboIdApiResponse,
  CombosApiResponse,
  DishCombo,
} from "@/app/types/combo_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ==================== Fetch All Combos ====================
export const fetchCombos = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  keyword: string = "",
  category: number | null = null
): Promise<Combo[]> => {
  try {
    const response = await axios.get<CombosApiResponse>(
      `${API_URL}/combo/get-all-combo/${pageNumber}/${pageSize}`,
      {
        params: { keyword, category },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Check if the API call was successful
    if (data.isSuccess) {
      // showSuccessMessage("Combos fetched successfully!");
      // Map API data to Combo objects
      const combos: Combo[] = data.result.map((item) => ({
        comboId: item.comboId,
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price || 0,
        discount: item.discount,
        categoryId: item.categoryId,
        rating: item.averageRating,
        ratingCount: item.numberOfRating,
        category: {
          id: item.categoryId,
          name: item.category.name,
          vietnameseName: item.category.vietnameseName,
        },
        startDate: item.startDate,
        endDate: item.endDate,
        isDeleted: item.isDeleted, // Optional
        isAvailable: item.isAvailable, // Optional
      }));
      return combos;
    } else {
      const errorMessage = data.messages?.[0] || "Failed to fetch combos.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while fetching combos.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};

// ==================== Fetch Combo By ID ====================
export const fetchComboById = async (
  comboId: string
): Promise<ComboIdApiResponse> => {
  try {
    const response = await axios.get<ComboIdApiResponse>(
      `${API_URL}/combo/get-combo-by-id-ver-2/${comboId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = response.data;

    // Check if the API call was successful
    if (data.isSuccess) {
      // showSuccessMessage("Combo details fetched successfully!");
      return data;
    } else {
      const errorMessage =
        data.messages?.[0] || "Failed to fetch combo details.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while fetching combo details.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};
