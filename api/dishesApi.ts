import axios from "axios"; // Import Axios directly
import { Dish, DishesApiResponse } from "@/app/types/dishes_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// const API_URL = "http://localhost:3000";

export const fetchDishes = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  keyword: string = "",
  type: number | null = null
): Promise<Dish[]> => {
  try {
    const response = await axios.get<DishesApiResponse>(
      `${API_URL}/dish/get-all-dish/${pageNumber}/${pageSize}`,
      {
        params: { keyword, type },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("response", response); // Debugging line

    // Ánh xạ dữ liệu trả về từ API
    const dishes: Dish[] = response.data.result.items.map((item) => {
      const dishData = item.dish; // Lấy dữ liệu dish từ object chính

      return {
        id: dishData.dishId, // Sử dụng dishId thay vì id
        name: dishData.name,
        description: dishData.description,
        image: dishData.image,
        dishItemTypeId: dishData.dishItemTypeId,
        isAvailable: dishData.isAvailable,
        dishItemType: {
          id: dishData.dishItemType.id,
          name: dishData.dishItemType.name,
          vietnameseName: dishData.dishItemType.vietnameseName,
        },
        dishSizeDetails: item.dishSizeDetails.map((detail) => ({
          dishSizeDetailId: detail.dishSizeDetailId,
          isAvailable: detail.isAvailable,
          price: detail.price,
          discount: detail.discount,
          dishId: detail.dishId,
          dishSizeId: detail.dishSizeId,
          dishSize: {
            id: detail.dishSize.id,
            name: detail.dishSize.name,
            vietnameseName: detail.dishSize.vietnameseName,
          },
        })),
        rating: 4.5, // Placeholder value
        ratingCount: 150, // Placeholder value
        price: "200.000vnd", // Placeholder value
        quantity: 1, // Optional
      };
    });

    return dishes;
  } catch (error) {
    console.error("Full error:", error); // Chi tiết lỗi sẽ được in ra console
    throw error;
  }
};
