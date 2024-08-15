//src/ redux / slices / dishesSlice.ts
import { fetchDishes } from "@/api/dishesApi";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isLoading } from "expo-font";

interface Dish {
  id: number;
  name: string;
  price: string;
  image: string | number; // Update to accept both local and URL images
  quantity: number;
  rating: number;
  ratingCount: number;
  type: string;
}

interface DishesState {
  selectedDishes: Dish[];
}

const initialState: DishesState = {
  selectedDishes: [],
};

export const loadDishes = createAsyncThunk(
  "dishes/loadDishes",
  async ({
    pageNumber = 1,
    pageSize = 10,
    keyword = "",
    type = null,
  }: {
    pageNumber?: number;
    pageSize?: number;
    keyword?: string;
    type?: number | null;
  }) => {
    const data = await fetchDishes(pageNumber, pageSize, keyword, type);
    return data;
  }
);

// console.log("loadDishes", loadDishes);

const dishesSlice = createSlice({
  name: "dishes",
  initialState,

  reducers: {
    addOrUpdateDish: (state, action: PayloadAction<Dish>) => {
      const index = state.selectedDishes.findIndex(
        (dish) => dish.id === action.payload.id
      );
      if (index !== -1) {
        // Simply increment the existing quantity by 1 instead of adding payload quantity
        state.selectedDishes[index].quantity += 1;
      } else {
        // Add new dish if it doesn't exist with initial quantity set to 1 (ignore payload quantity for new adds)
        const newDish = {
          ...action.payload,
          quantity: 1, // Initialize with 1 when adding new
        };
        state.selectedDishes.push(newDish);
      }
    },
    removeDish: (state, action: PayloadAction<number>) => {
      const index = state.selectedDishes.findIndex(
        (dish) => dish.id === action.payload
      );

      if (index >= 0) {
        if (state.selectedDishes[index].quantity > 1) {
          state.selectedDishes[index].quantity -= 1;
        } else {
          state.selectedDishes.splice(index, 1);
        }
      }
    },
    clearDishes: (state) => {
      state.selectedDishes = [];
    },
  },
});

export const { addOrUpdateDish, removeDish, clearDishes } = dishesSlice.actions;
export default dishesSlice.reducer;
