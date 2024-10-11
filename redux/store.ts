// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer"; // Import the rootReducer

const store = configureStore({
  reducer: rootReducer, // Use the rootReducer here
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
