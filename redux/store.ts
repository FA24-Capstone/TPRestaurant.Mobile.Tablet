// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import dishesReducer from "./slices/dishesSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    dishes: dishesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
