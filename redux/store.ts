// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import dishesReducer from "./slices/dishesSlice";
import authReducer from "./slices/authSlice";
import reservationReducer from "./slices/reservationSlice";
import tableSessionReducer from "./slices/tableSessionSlice";
import ordersReducer from "./slices/ordersSlice";

const store = configureStore({
  reducer: {
    dishes: dishesReducer,
    auth: authReducer,
    reservation: reservationReducer,
    tableSession: tableSessionReducer, // Add this line
    orders: ordersReducer, // Add this line
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
