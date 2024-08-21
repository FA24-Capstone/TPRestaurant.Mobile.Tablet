//src/ redux / slices / dishesSlice.ts
import { fetchDishes } from "@/api/dishesApi";
import { ComboOrder } from "@/app/types/order_type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isLoading } from "expo-font";

interface Dish {
  id: string;
  name: string;
  price: number;
  image: string | number; // Update to accept both local and URL images
  quantity: number;
  rating: number;
  ratingCount: number;
  type: string;
  size?: string;
  sizePrice?: number; // Add sizePrice field to store the price of the selected size
}

interface DishesState {
  selectedDishes: Dish[];
  selectedCombos: ComboOrder[];
}

// interface ComboOrder {
//   id?: string; // Normalized ID for rendering
//   comboId: string;
//   comboName: string;
//   comboImage: string | number;
//   comboPrice: number;
//   selectedDishes: { id: string; name: string; price: number }[];
//   type?: string; // Added to differentiate in renderItem
// }

const initialState: DishesState = {
  selectedDishes: [],
  selectedCombos: [],
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
    addOrUpdateCombo: (state, action: PayloadAction<ComboOrder>) => {
      const index = state.selectedCombos.findIndex(
        (combo) => combo.comboId === action.payload.comboId
      );
      if (index !== -1) {
        state.selectedCombos[index] = {
          ...state.selectedCombos[index],
          ...action.payload,
        };
      } else {
        state.selectedCombos.push(action.payload);
      }
    },
    removeCombo: (state, action: PayloadAction<string>) => {
      state.selectedCombos = state.selectedCombos.filter(
        (combo) => combo.comboId !== action.payload
      );
    },
    addOrUpdateDish: (state, action: PayloadAction<Dish>) => {
      const uniqueKey = `${action.payload.id}_${action.payload.size}`;
      const index = state.selectedDishes.findIndex(
        (dish) => `${dish.id}_${dish.size}` === uniqueKey
      );
      // // Tìm index dựa trên id và size
      // const index = state.selectedDishes.findIndex(
      //   (dish) =>
      //     dish.id === action.payload.id && dish.size === action.payload.size
      // );
      if (index !== -1) {
        // Nếu tìm thấy món ăn với cùng id và size, tăng số lượng
        state.selectedDishes[index].quantity += 1;
      } else {
        // Nếu không, thêm món mới với số lượng khởi tạo là 1
        const newDish = {
          ...action.payload,
          quantity: 1, // Khởi tạo với số lượng là 1 khi thêm mới
        };
        state.selectedDishes.push(newDish);
      }
    },

    removeDishQuanti: (state, action: PayloadAction<string>) => {
      const index = state.selectedDishes.findIndex(
        (dish) => `${dish.id}_${dish.size}` === action.payload
      );
      if (index >= 0) {
        if (state.selectedDishes[index].quantity > 1) {
          state.selectedDishes[index].quantity -= 1;
        } else {
          state.selectedDishes.splice(index, 1);
        }
      }
    },
    removeDishItem: (state, action: PayloadAction<string>) => {
      state.selectedDishes = state.selectedDishes.filter(
        (dish) => `${dish.id}_${dish.size}` !== action.payload
      );
    },
    clearDishes: (state) => {
      state.selectedDishes = [];
      state.selectedCombos = [];
    },
  },
});

export const {
  addOrUpdateDish,
  removeDishQuanti,
  clearDishes,
  removeCombo,
  removeDishItem,
  addOrUpdateCombo,
} = dishesSlice.actions;
export default dishesSlice.reducer;
