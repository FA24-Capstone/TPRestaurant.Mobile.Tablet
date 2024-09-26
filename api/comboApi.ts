import axios from "axios";
import {
  Combo,
  ComboIdApiResponse,
  CombosApiResponse,
  DishCombo,
} from "@/app/types/combo_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
    console.log("fetchCombos response data:", response.data);

    // Ánh xạ dữ liệu trả về từ API
    const combos: Combo[] = response.data.result.map((item) => ({
      comboId: item.comboId,
      name: item.name,
      description: item.description,
      image: item.image,
      price: item.price,
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
    }));

    console.log("fetchCombos Ne", combos);

    return combos;
  } catch (error) {
    console.error("Full error:", error); // Chi tiết lỗi sẽ được in ra console
    throw error;
  }
};

export const fetchComboById = async (
  comboId: string
): Promise<ComboIdApiResponse> => {
  try {
    console.log("comboIdNe", comboId);

    const response = await axios.get<ComboIdApiResponse>(
      `${API_URL}/combo/get-combo-by-id/${comboId}`,
      { headers: { "Content-Type": "application/json" } }
    );
    // Log detailed response for debugging
    // console.log(
    //   "API response for combo details:",
    //   JSON.stringify(response.data.result, null, 2)
    // );
    // Return the response directly if it matches the expected shape
    return response.data;
  } catch (error) {
    // Log and rethrow the error to handle it in the caller function or middleware
    console.error("Failed to fetch combo details:", error);
    throw error;
  }
};
