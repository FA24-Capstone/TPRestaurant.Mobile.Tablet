// src/redux/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import dishesReducer from "./slices/dishesSlice";
import authReducer, { logout } from "./slices/authSlice";
import reservationReducer from "./slices/reservationSlice";
import tableSessionReducer from "./slices/tableSessionSlice";
import ordersReducer from "./slices/ordersSlice";

const appReducer = combineReducers({
  dishes: dishesReducer,
  auth: authReducer,
  reservation: reservationReducer,
  tableSession: tableSessionReducer,
  orders: ordersReducer,
});

const rootReducer = (state, action) => {
  if (action.type === logout.type) {
    // Reset all states by passing undefined state to appReducer
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
