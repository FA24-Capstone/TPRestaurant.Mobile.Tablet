// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer"; // Import the rootReducer
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createTransform,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState } from "./slices/authSlice";

// Tạo transform để loại bỏ token khi rememberMe là false
const authTransform = createTransform(
  (inboundState: AuthState, key) => {
    if (!inboundState.rememberMe) {
      // Khi rememberMe là false, loại bỏ token
      return {
        ...inboundState,
        token: null,
      };
    }
    return inboundState;
  },
  (outboundState: AuthState, key) => outboundState,
  { whitelist: ["auth"] }
);

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"], // Chỉ lưu trữ slice 'auth'
  transforms: [authTransform], // Áp dụng transform
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store với persistedReducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Loại bỏ một số hành động không cần thiết để tránh cảnh báo
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// const store = configureStore({
//   reducer: rootReducer, // Use the rootReducer here
// });

// Tạo persistor
export const persistor = persistStore(store);

// Xuất các kiểu
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
