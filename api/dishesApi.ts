import axios from "axios"; // Import Axios directly
import { Dish, DishesApiResponse } from "@/app/types/dishes_type";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// const API_URL = "http://localhost:3000";

export const fetchDishes = async (
  pageNumber: number = 1,
  pageSize: number = 6,
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
    // Ánh xạ dữ liệu trả về từ API
    const dishes: Dish[] = response.data.result.items.map((item) => {
      const dishData = item?.dish; // Lấy dữ liệu dish từ object chính
      // console.log("itemNe", JSON.stringify(item)); // In ra response từ API

      return {
        id: dishData?.dishId, // Sử dụng dishId thay vì id
        name: dishData?.name,
        description: dishData?.description,
        image: dishData?.image,
        dishItemTypeId: dishData?.dishItemTypeId,
        isAvailable: dishData?.isAvailable ?? true,
        // averageRating: dishData?.averageRating,
        // numberOfRating: dishData?.numberOfRating,
        dishItemType: {
          id: dishData?.dishItemType?.id,
          name: dishData?.dishItemType?.name,
          vietnameseName: dishData?.dishItemType?.vietnameseName,
        },
        dishSizeDetails: item.dishSizeDetails.map((detail) => ({
          dishSizeDetailId: detail?.dishSizeDetailId, //
          isAvailable: detail?.isAvailable, //
          price: detail?.price, //
          discount: detail?.discount, //
          dishId: detail?.dishId, //
          dishSizeId: detail?.dishSizeId, //
          dishSize: {
            id: detail?.dishSize.id,
            name: detail?.dishSize.name,
            vietnameseName: detail?.dishSize.vietnameseName,
          },
          dish: detail?.dish, // Add missing property
          quantityLeft: detail?.quantityLeft, // Add missing property
          dailyCountdown: detail?.dailyCountdown, // Add missing property
        })),
        rating: dishData?.averageRating, // Placeholder value
        ratingCount: dishData?.numberOfRating, // Placeholder value
        price: item?.dishSizeDetails[0]?.price ?? 0, // Placeholder value
        quantity: 1, // Optional
        isDeleted: dishData?.isDeleted, // Optional
      };
    });
    // console.log("dishesNe1", JSON.stringify(dishes)); // In ra response từ API

    return dishes;
  } catch (error) {
    console.error("Full error dish:", error); // Chi tiết lỗi sẽ được in ra console
    throw error;
  }
};
