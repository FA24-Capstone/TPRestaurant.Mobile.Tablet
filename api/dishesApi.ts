import axios from "axios"; // Import Axios directly
import { Dish, DishesApiResponse } from "@/app/types/dishes_type";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import apiClient from "./config";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// const API_URL = "http://localhost:3000";

// ==================== Fetch All Dishes ====================
export const fetchDishes = async (
  pageNumber: number = 1,
  pageSize: number = 6,
  keyword: string = "",
  type: number | null = null
): Promise<Dish[]> => {
  try {
    const response = await apiClient.get<DishesApiResponse>(
      `/dish/get-all-dish/${pageNumber}/${pageSize}`,
      {
        params: { keyword, type },
      }
    );

    const data = response.data;

    // Check if the API call was successful
    if (data.isSuccess) {
      // showSuccessMessage("Dishes fetched successfully!");

      // Map API data to Dish objects
      const dishes: Dish[] = data.result.items.map((item) => {
        const dishData = item?.dish;

        return {
          id: dishData?.dishId,
          name: dishData?.name,
          description: dishData?.description,
          image: dishData?.image,
          dishItemTypeId: dishData?.dishItemTypeId,
          isAvailable: dishData?.isAvailable ?? true,
          dishItemType: {
            id: dishData?.dishItemType?.id,
            name: dishData?.dishItemType?.name,
            vietnameseName: dishData?.dishItemType?.vietnameseName,
          },
          dishSizeDetails: item.dishSizeDetails.map((detail) => ({
            dishSizeDetailId: detail?.dishSizeDetailId,
            isAvailable: detail?.isAvailable,
            price: detail?.price,
            discount: detail?.discount,
            dishId: detail?.dishId,
            dishSizeId: detail?.dishSizeId,
            dishSize: {
              id: detail?.dishSize.id,
              name: detail?.dishSize.name,
              vietnameseName: detail?.dishSize.vietnameseName,
            },
            dish: detail?.dish,
            quantityLeft: detail?.quantityLeft,
            dailyCountdown: detail?.dailyCountdown,
          })),
          rating: dishData?.averageRating,
          ratingCount: dishData?.numberOfRating,
          price: item?.dishSizeDetails[0]?.price ?? 0,
          quantity: 1,
          isDeleted: dishData?.isDeleted,
        };
      });

      return dishes;
    } else {
      const errorMessage = data.messages?.[0] || "Failed to fetch dishes.";
      showErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.messages?.[0] ||
        "An error occurred while fetching dishes.";
      showErrorMessage(backendMessage);
      throw new Error(backendMessage);
    } else {
      showErrorMessage("An unexpected error occurred.");
      throw new Error("An unexpected error occurred.");
    }
  }
};
