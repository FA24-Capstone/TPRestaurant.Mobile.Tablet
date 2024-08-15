import axios from "axios"; // Import Axios directly
import { Dish, DishesApiResponse } from "@/app/types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

    // Map the response data to the Dish interface
    const dishes: Dish[] = response.data.result.items.map((item) => ({
      id: item.dishId,
      name: item.name,
      description: item.description,
      image: item.image,
      type: item.dishItemType.name,
      isAvailable: item.isAvailable,
      rating: 4.5, // Placeholder value, adjust as needed
      ratingCount: 150, // Placeholder value, adjust as needed
      price: "200.000vnd", // Placeholder value, adjust as needed
      quantity: 1, // Optional, can be set later in the app
    }));

    return dishes;
  } catch (error) {
    console.log("Full error:", error); // This will give you more details
    throw error;
  }
};
