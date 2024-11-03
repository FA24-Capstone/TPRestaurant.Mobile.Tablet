//src/ redux / slices / dishesSlice.ts
import { fetchDishes } from "@/api/dishesApi";
import { Dish, DishSizeDetail } from "@/app/types/dishes_type";
import { ComboOrder } from "@/components/Order/ComboOrderItem";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isLoading } from "expo-font";

interface SelectedDish extends Dish {
  selectedSizeDetail: DishSizeDetail; // Directly include the selected size detail
  quantity: number; // Ensure quantity is always present
}

interface DishesState {
  selectedDishes: SelectedDish[]; // Use SelectedDish type for selected dishes
  selectedCombos: ComboOrder[];
}

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
      // console.log("stateSelec", state.selectedCombos);

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
    increaseComboQuantity: (state, action: PayloadAction<string>) => {
      const combo = state.selectedCombos.find(
        (combo) => combo.comboId === action.payload
      );
      if (combo) {
        combo.quantity += 1;
      }
    },

    decreaseComboQuantity: (state, action: PayloadAction<string>) => {
      const combo = state.selectedCombos.find(
        (combo) => combo.comboId === action.payload
      );
      if (combo) {
        if (combo.quantity > 1) {
          combo.quantity -= 1;
        } else {
          // Remove combo if the quantity is 1 and is being decreased
          state.selectedCombos = state.selectedCombos.filter(
            (item) => item.comboId !== action.payload
          );
        }
      }
    },

    addOrUpdateDish: (
      state,
      action: PayloadAction<{ dish: Dish; selectedSizeId: string }>
    ) => {
      const { dish, selectedSizeId } = action.payload;

      const selectedSizeDetail = dish.dishSizeDetails.find(
        (sizeDetail) => sizeDetail.dishSizeDetailId === selectedSizeId
      );

      if (!selectedSizeDetail) return; // If no selected size detail, do nothing

      const uniqueKey = `${dish.id}_${selectedSizeId}`;
      const index = state.selectedDishes.findIndex(
        (selectedDish) =>
          `${selectedDish.id}_${selectedDish.selectedSizeDetail.dishSizeDetailId}` ===
          uniqueKey
      );

      if (index !== -1) {
        // If dish with same id and size exists, increase quantity
        state.selectedDishes[index].quantity += 1;
      } else {
        // Otherwise, add a new dish with selected size detail and quantity 1
        state.selectedDishes.push({
          ...dish,
          selectedSizeDetail, // Store the selected size detail directly
          quantity: 1,
        });
      }
    },

    removeDishItem: (
      state,
      action: PayloadAction<{ dishId: string; selectedSizeId: string }>
    ) => {
      const { dishId, selectedSizeId } = action.payload;

      state.selectedDishes = state.selectedDishes.filter(
        (selectedDish) =>
          `${selectedDish.id}_${selectedDish.selectedSizeDetail.dishSizeDetailId}` !==
          `${dishId}_${selectedSizeId}`
      );
    },

    removeDishQuanti: (
      state,
      action: PayloadAction<{ dishId: string; selectedSizeId: string }>
    ) => {
      const { dishId, selectedSizeId } = action.payload;

      const index = state.selectedDishes.findIndex(
        (selectedDish) =>
          `${selectedDish.id}_${selectedDish.dishSizeDetails[0].dishSizeDetailId}` ===
          `${dishId}_${selectedSizeId}`
      );
      if (index >= 0) {
        if ((state.selectedDishes[index].quantity || 0) > 1) {
          state.selectedDishes[index].quantity! -= 1;
        } else {
          state.selectedDishes.splice(index, 1);
        }
      }
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
  increaseComboQuantity,
  decreaseComboQuantity,
} = dishesSlice.actions;
export default dishesSlice.reducer;
