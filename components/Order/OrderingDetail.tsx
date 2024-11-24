import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import OrderItemList from "./OrderItemList";
import { clearDishes } from "@/redux/slices/dishesSlice";
import OrderFooter from "./OrderingFooter";
import moment, { now } from "moment-timezone";
import { showErrorMessage, showSuccessMessage } from "../FlashMessageHelpers";
import { setCurrentSession } from "@/redux/slices/tableSessionSlice";
import { OrderDetailsDto, OrderRequest } from "@/app/types/order_type";
import { addPrelistOrder, createOrderinTablet } from "@/api/ordersApi";
import { Combo } from "@/app/types/combo_type";
import { addOrder } from "@/redux/slices/ordersSlice";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import LoadingOverlay from "../LoadingOverlay";

type RootStackParamList = {
  "history-order": undefined; // Add this line
};

const OrderingDetail: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch: AppDispatch = useDispatch();
  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );
  const { deviceId, deviceCode, tableId, tableName } = useSelector(
    (state: RootState) => state.auth
  );
  const tableSession = useSelector(
    (state: RootState) => state.tableSession.currentSession
  );

  const currentOrder = useSelector(
    (state: RootState) => state.orders.currentOrder
  ); // Lấy currentOrder từ state

  const startSession = now();
  // console.log("tableId nha", tableId);

  // console.log("reservationDataWhere", reservationData);

  const [note, setNote] = useState("");
  const [noteChild, setNoteChild] = useState<{ [key: string]: string }>({});

  const selectedDishes = useSelector(
    (state: RootState) => state.dishes.selectedDishes
  );
  const selectedCombos = useSelector(
    (state: RootState) => state.dishes.selectedCombos
  );
  const [isLoading, setIsLoading] = useState(false);

  const dishes = useSelector((state: RootState) => state.dishes.selectedDishes);
  const combos = useSelector((state: RootState) => state.dishes.selectedCombos);

  const accountByPhone = useSelector((state: RootState) => state.account.data);

  console.log("isLoadingNha", isLoading);

  // Function to update note for a specific item (dish/combo)
  const updateNote = (id: string, value: string) => {
    setNoteChild((prevNotes) => ({
      ...prevNotes,
      [id]: value,
    }));
  };

  const numberOfPeople = reservationData?.result?.order.numOfPeople || 0;

  const handleClearAll = () => {
    dispatch(clearDishes()); // Dispatch the action to clear all dishes
  };

  const handleOrderNow = async () => {
    if (isLoading) return; // Ngăn chặn gọi lại nếu đang loading

    setIsLoading(true); // Bắt đầu loading

    if (!tableId) {
      showErrorMessage("Mã bàn không được tìm thấy.");
      setIsLoading(false);
      return;
    }

    const customerId =
      reservationData?.result?.order.accountId || accountByPhone?.id;
    const orderType = reservationData?.result?.order.reservationDate ? 1 : 3; // 1 cho Reservation, 3 cho MealWithoutReservation

    const orderDetailsDtos: OrderDetailsDto[] = [
      ...selectedDishes.map((dish) => ({
        dishSizeDetailId: dish.selectedSizeDetail.dishSizeDetailId,
        quantity: dish.quantity,
        note: noteChild[dish.id] || "", // Sử dụng ghi chú riêng cho dish        dishSizeDetailId: dish.selectedSizeDetail.dishSizeDetailId,
      })),
      ...selectedCombos.map((combo) => ({
        quantity: combo.quantity,
        combo: {
          comboId: combo.comboId,
          dishComboIds: combo.selectedDishes.map((dish) => dish.id),
        },
        note: noteChild[combo.comboId] || "", // Sử dụng ghi chú riêng cho combo
      })),
    ];

    const orderRequest: OrderRequest = {
      // customerId: customerId || "", // Tạm thời để là undefined nếu không có
      orderType,
      note, // Ghi chú tổng của order
      orderDetailsDtos,
      ...(!customerId && !reservationData
        ? {
            mealWithoutReservation: {
              numberOfPeople: 0, // Có thể chỉnh sửa tuỳ thuộc vào logic của bạn
              tableIds: [tableId], // Sử dụng tableId từ state
            },
          }
        : customerId && !reservationData
        ? {
            mealWithoutReservation: {
              numberOfPeople: 0, // Có thể chỉnh sửa tuỳ thuộc vào logic của bạn
              tableIds: [tableId], // Sử dụng tableId từ state
            },
            customerId: customerId,
          }
        : {
            customerId: customerId,
          }),
    };
    console.log("orderRequestNHa", JSON.stringify(orderRequest, null, 2));
    console.log("reservationData?nha", reservationData);

    try {
      // console.log("currentOrder", currentOrder);
      console.log("reservationDataNha", reservationData);
      setIsLoading(true);
      // Kiểm tra currentOrder và trạng thái của nó
      if ((!currentOrder || currentOrder.statusId === 8) && !reservationData) {
        console.log(
          "orderRequestVaoCreate",
          JSON.stringify(orderRequest, null, 2)
        );

        // Nếu chưa có order hoặc trạng thái là 7 hoặc 8 thì tạo order mới
        const response = await createOrderinTablet(orderRequest);
        console.log("responseCreateNe", JSON.stringify(response, null, 2));
        setIsLoading(false);

        if (response.isSuccess) {
          showSuccessMessage("Đặt món thành công!");
          dispatch(clearDishes());
          dispatch(addOrder(response.result.order)); // Store the new order in state
        } else {
          const errorMessage =
            response.messages?.[0] || "Đặt món thất bại. Vui lòng thử lại!";
          showErrorMessage(errorMessage);
        }
      } else {
        // Nếu đã có order và trạng thái khác 7 và 8 thì thêm món vào order
        if (currentOrder || reservationData?.result?.order.orderId) {
          console.log(
            "reservationData.result.order.orderId",
            reservationData?.result.order.orderId
          );
          const addOrderResponse = await addPrelistOrder(
            {
              orderId:
                currentOrder?.orderId ||
                reservationData?.result?.order.orderId ||
                "",
              orderDetailsDtos,
            },
            currentOrder?.orderId ||
              reservationData?.result?.order.orderId ||
              ""
          );
          setIsLoading(false);

          // console.log(
          //   "addOrderResponseNe",
          //   JSON.stringify(addOrderResponse, null, 2)
          // );

          if (addOrderResponse.isSuccess) {
            showSuccessMessage("Thêm món thành công!");
            dispatch(clearDishes());
            // Optionally, update the order after adding the dish
          } else {
            const errorMessage =
              addOrderResponse.messages?.[0] ||
              "Đặt món thất bại. Vui lòng thử lại!";
            showErrorMessage(errorMessage);
          }
        }
      }
    } catch (error) {
      showErrorMessage("Xử lý thất bại. Vui lòng thử lại!");
      console.error("Failed to process order:", error);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const handleHistoryOrder = () => {
    // Navigate to the "history-order" screen
    navigation.navigate("history-order");
  };

  return (
    <>
      {isLoading && (
        <View>
          <LoadingOverlay visible={isLoading} />
        </View>
      )}
      <View className="flex-1 px-2 bg-white">
        <View className="border-b border-gray-400 pb-4">
          {/* <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold mb-1 text-gray-600">
            MÃ ĐƠN ĐẶT MÓN :
          </Text>
          <Text className="font-bold text-lg text-gray-600">#12564878</Text>
        </View> */}

          <View className="flex-row justify-between w-full">
            <View className="w-[50%]">
              <View className="flex-row mt-1 items-center">
                {/* <Text className="text-gray-600 mr-3 ml-2 font-semibold"></Text> */}
                <MaterialCommunityIcons name="account" size={20} color="gray" />
                <Text className="text-[#EDAA16] text-sm ml-3 font-semibold">
                  {numberOfPeople} người
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="clock" size={20} color="gray" />

                <Text className="text-[#EDAA16] text-sm ml-3 font-bold">
                  {moment(reservationData?.result?.order?.mealTime)
                    .local()
                    .format("HH:mm, DD/MM/YYYY")}
                </Text>
              </View>
            </View>
            <View className="justify-between p-2">
              <Text className="font-semibold text-gray-600 text-sm">
                Bạn đã đặt {reservationData?.result?.orderDishes?.length || 0}{" "}
                món
              </Text>
              <TouchableOpacity onPress={handleHistoryOrder}>
                <Text className="text-right font-semibold text-base italic text-[#C01D2E]">
                  Xem
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {selectedDishes.length === 0 && selectedCombos.length === 0 ? (
          <View className="flex-1 justify-center items-center overflow-hidden">
            <Image
              source={require("../../assets/Icons/NoProduct.jpeg")}
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
            <OrderItemList
              dishes={dishes}
              combos={combos}
              noteChild={noteChild} // Truyền notes
              updateNote={updateNote} // Truyền hàm cập nhật ghi chú
            />
            <View>
              <OrderFooter note={note} setNote={setNote} />
              <TouchableOpacity
                onPress={handleOrderNow}
                className="bg-[#C01D2E] p-3 rounded-md"
                disabled={isLoading} // Vô hiệu hóa nút khi loading
              >
                <Text className="text-white text-center text-lg font-bold uppercase">
                  Đặt món ngay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default OrderingDetail;
