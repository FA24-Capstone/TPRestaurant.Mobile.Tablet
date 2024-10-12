// src/redux/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import dishesReducer from "./slices/dishesSlice";
import authReducer, { logout } from "./slices/authSlice";
import reservationReducer from "./slices/reservationSlice";
import tableSessionReducer from "./slices/tableSessionSlice";
import ordersReducer from "./slices/ordersSlice";
import { clearAllExceptAuth } from "./actions"; // Import action mới

const appReducer = combineReducers({
  dishes: dishesReducer,
  auth: authReducer,
  reservation: reservationReducer,
  tableSession: tableSessionReducer,
  orders: ordersReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === logout.type) {
    // Khi logout, reset toàn bộ state
    return appReducer(undefined, action);
  }

  if (action.type === clearAllExceptAuth.type) {
    // Lưu trữ trạng thái auth hiện tại
    const { auth } = state as any;

    // Reset các slice khác về trạng thái ban đầu
    return {
      auth, // Giữ nguyên auth
      dishes: dishesReducer(undefined, { type: "unknown" }),
      reservation: reservationReducer(undefined, { type: "unknown" }),
      tableSession: tableSessionReducer(undefined, { type: "unknown" }),
      orders: ordersReducer(undefined, { type: "unknown" }),
      // Thêm các slice khác nếu có
    };
  }

  return appReducer(state, action);
};

export default rootReducer;

//Xử Lý Action logout: Khi action logout được dispatch, toàn bộ state Redux sẽ được reset về undefined, tức là các slice sẽ trở về trạng thái ban đầu của chúng.
//Xử Lý Action clearAllExceptAuth: Khi action này được dispatch, chỉ có slice auth được giữ nguyên, còn các slice khác sẽ được reset về trạng thái ban đầu bằng cách gọi reducer của chúng với state undefined và một action không xác định ({ type: "unknown" }).
