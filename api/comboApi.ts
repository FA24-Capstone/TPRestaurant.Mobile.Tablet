import axios from "axios";
import { Combo, CombosApiResponse } from "@/app/types/combo_type";

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

    // Ánh xạ dữ liệu trả về từ API
    const combos: Combo[] = response.data.result.items.map((item) => ({
      comboId: item.comboId,
      name: item.name,
      description: item.description,
      image: item.image,
      price: item.price,
      discount: item.discount,
      categoryId: item.categoryId,
      category: {
        id: item.category.id,
        name: item.category.name,
        vietnameseName: item.category.vietnameseName,
      },
      startDate: item.startDate,
      endDate: item.endDate,
    }));

    return combos;
  } catch (error) {
    console.error("Full error:", error); // Chi tiết lỗi sẽ được in ra console
    throw error;
  }
};
