import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import OrderItemList from "./OrderItemList";
import { clearDishes } from "@/redux/slices/dishesSlice";
import OrderFooter from "./OrderingFooter";
import moment from "moment-timezone";
import { addNewPrelistOrder, addTableSession } from "@/api/tableSection";
import { showErrorMessage, showSuccessMessage } from "../FlashMessageHelpers";
import { setCurrentSession } from "@/redux/slices/tableSessionSlice";
import { OrderDetailsDto, OrderRequest } from "@/app/types/order_type";
import { addPrelistOrder, createOrderinTablet } from "@/api/ordersApi";
import { Combo } from "@/app/types/combo_type";
import { addOrder } from "@/redux/slices/ordersSlice";

const OrderingDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { deviceId, deviceCode, tableId, tableName } = useSelector(
    (state: RootState) => state.auth
  );
  const tableSession = useSelector(
    (state: RootState) => state.tableSession.currentSession
  );

  const currentOrder = useSelector(
    (state: RootState) => state.orders.currentOrder
  ); // Lấy currentOrder từ state

  const startSession = tableSession?.startTime;
  console.log("tableId nha", tableId);

  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );
  console.log("reservationDataWhere", reservationData);

  const [note, setNote] = useState("");

  const selectedDishes = useSelector(
    (state: RootState) => state.dishes.selectedDishes
  );
  const selectedCombos = useSelector(
    (state: RootState) => state.dishes.selectedCombos
  );
  const dishes = useSelector((state: RootState) => state.dishes.selectedDishes);
  const combos = useSelector((state: RootState) => state.dishes.selectedCombos);

  const combinedOrders = [
    ...dishes,
    ...combos.map((combo) => ({
      ...combo,
      id: combo.comboId, // Normalize id for keyExtractor
      type: "combo", // Add type for distinguishing in renderItem
    })),
  ];

  const numberOfPeople = reservationData?.result?.items[0]?.numberOfPeople || 0;

  const handleClearAll = () => {
    dispatch(clearDishes()); // Dispatch the action to clear all dishes
  };

  const handleOrderNow = async () => {
    if (!tableId) {
      showErrorMessage("Mã bàn không được tìm thấy.");
      return;
    }

    const customerId = reservationData?.result?.items[0]?.customerId;
    const orderType = customerId ? 1 : 3; // 1 cho Reservation, 3 cho MealWithoutReservation

    const orderDetailsDtos: OrderDetailsDto[] = [
      ...selectedDishes.map((dish) => ({
        quantity: dish.quantity,
        dishSizeDetailId: dish.selectedSizeDetail.dishSizeDetailId,
        note: "", // Ghi chú riêng của dish
      })),
      ...selectedCombos.map((combo) => ({
        quantity: combo.quantity,
        combo: {
          comboId: combo.comboId,
          dishComboIds: combo.selectedDishes.map((dish) => dish.id),
        },
        note: "", // Ghi chú riêng của combo
      })),
    ];

    const orderRequest: OrderRequest = {
      customerId: customerId || null, // Tạm thời để là null nếu không có
      orderType,
      note, // Ghi chú tổng của order
      orderDetailsDtos,
      ...(customerId
        ? {
            reservationOrder: {
              numberOfPeople:
                reservationData?.result?.items[0]?.numberOfPeople || 0,
              mealTime: moment().format("YYYY-MM-DDTHH:mm:ss"), // Thời gian ăn
              endTime: moment().add(2, "hours").format("YYYY-MM-DDTHH:mm:ss"), // Ví dụ kết thúc sau 2 giờ
              isPrivate: false, // Có thể tuỳ chỉnh
              deposit: 0, // Số tiền đặt cọc, nếu có
              paymentMethod: 1, // Phương thức thanh toán
            },
          }
        : {
            mealWithoutReservation: {
              numberOfPeople: 0, // Có thể chỉnh sửa tuỳ thuộc vào logic của bạn
              tableIds: [tableId], // Sử dụng tableId từ state
            },
          }),
    };

    try {
      // Kiểm tra currentOrder và trạng thái của nó
      if (
        !currentOrder ||
        currentOrder.statusId === 7 ||
        currentOrder.statusId === 8
      ) {
        // Nếu chưa có order hoặc trạng thái là 7 hoặc 8 thì tạo order mới
        const response = await createOrderinTablet(orderRequest);
        if (response.isSuccess) {
          showSuccessMessage("Đặt món thành công!");
          dispatch(clearDishes());
          dispatch(addOrder(response.result.order)); // Lưu order mới vào state
        } else {
          showErrorMessage("Đặt món thất bại. Vui lòng thử lại!");
        }
      } else {
        // Nếu đã có order và trạng thái khác 7 và 8 thì thêm món vào order
        const addOrderResponse = await addPrelistOrder(
          { orderId: currentOrder.orderId, orderDetailsDtos },
          currentOrder.orderId
        );

        console.log(
          "addOrderResponseNe",
          JSON.stringify(addOrderResponse, null, 2)
        );

        if (addOrderResponse.isSuccess) {
          showSuccessMessage("Thêm món thành công!");
          dispatch(clearDishes());
          // Có thể cập nhật lại order sau khi thêm món thành công
        } else {
          showErrorMessage("Thêm món thất bại. Vui lòng thử lại!");
        }
      }
    } catch (error) {
      showErrorMessage("Xử lý thất bại. Vui lòng thử lại!");
      console.error("Failed to process order:", error);
    }
  };

  return (
    <View className="flex-1 px-2 bg-white">
      <View className="border-b border-gray-400 pb-4">
        {/* <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold mb-1 text-gray-600">
            MÃ ĐƠN ĐẶT MÓN :
          </Text>
          <Text className="font-bold text-lg text-gray-600">#12564878</Text>
        </View> */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="account" size={24} color="gray" />
            {/* <Text className="text-gray-600 mr-3 ml-2 font-semibold"></Text> */}
            <Text className="text-[#EDAA16] text-xl ml-2 font-semibold">
              {numberOfPeople} người
            </Text>
          </View>
          {startSession && (
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="clock" size={24} color="gray" />
              {/* <Text className="text-gray-600 mr-3 ml-2 font-semibold">
                Bắt đầu từ:
              </Text> */}
              <Text className="text-[#EDAA16] text-lg ml-2 font-bold">
                {moment.utc(startSession).format("HH:mm, DD/MM/YYYY")}
                {/* {startSession} */}
              </Text>
            </View>
          )}
        </View>
      </View>
      {selectedDishes.length === 0 && selectedCombos.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../../assets/Icons/NoProduct.png")}
            className="w-40 h-40"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-medium text-xl text-center my-6 w-3/5 uppercase">
            HIỆN TẠI CHƯA CÓ MÓN NÀO ĐƯỢC CHỌN
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <TouchableOpacity onPress={handleClearAll}>
            <Text className="italic text-right text-[#E45834] my-1 font-semibold">
              Xoá sạch
            </Text>
          </TouchableOpacity>
          <OrderItemList dishes={dishes} combos={combos} />
          <View>
            <OrderFooter note={note} setNote={setNote} />
            <TouchableOpacity
              onPress={handleOrderNow}
              className="bg-[#C01D2E] p-3 rounded-md"
            >
              <Text className="text-white text-center text-lg font-bold uppercase">
                Đặt món ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default OrderingDetail;
