// redux/slices/ordersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { Order } from "@/app/types/order_type";

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
      state.currentOrder = action.payload;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
});

export const { setOrders, addOrder, setCurrentOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
