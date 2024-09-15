import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import ListOrder from "../List/ListOrder";
import { Order } from "@/app/types/dishes_type";
import { fetchTableSessionById } from "@/api/tableSection";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import DishCardHistory from "./CardHistory/DishCardHistory";
import ComboCardHistory from "./CardHistory/ComboCardHistory";
import {
  GetTableSessionResponse,
  UncheckedPrelistOrderDetail,
} from "@/app/types/tableSession_type";
import SearchBar from "../SearchBar";
import { Button, Modal, Portal, Provider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment-timezone";
import { Combo, OrderDetail, OrderDetails } from "@/app/types/order_type";
import { getHistoryOrderId } from "@/api/ordersApi";
import { DishSizeDetail } from "@/app/types/combo_type";

const { width } = Dimensions.get("window");
const numColumns = 4;
const spacing = 8; // Margin on each side
const itemWidth = (width - (numColumns + 1) * spacing) / numColumns;

const HistoryOrderPanel: React.FC = () => {
  const [dishes, setDishes] = useState<OrderDetail[]>([]);
  const [combos, setCombos] = useState<OrderDetail[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null); // State for modal content

  const currentOrder = useSelector(
    (state: RootState) => state.orders.currentOrder
  );

  console.log("orders nè", currentOrder);
  // Log ra => {"orderId":"6e5b9440-9478-4559-b572-da37d6ca6e1b","orderDate":"0001-01-01T00:00:00","deliveryTime":null,"reservationDate":null,"mealTime":"2024-09-14T13:14:13.6363496","endTime":null,"totalAmount":700000,"statusId":3,"status":null,"customerId":null,"customerInfo":null,"paymentMethodId":2,"paymentMethod":null,"loyalPointsHistoryId":null,"loyalPointsHistory":null,"note":"","orderTypeId":3,"orderType":null,"numOfPeople":0,"deposit":null,"isPrivate":null}
  const orderId = currentOrder?.orderId;

  console.log("modalContent nè", modalContent);

  // Function to fetch order details
  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;

    try {
      const response = await getHistoryOrderId(orderId);
      console.log("API response:", JSON.stringify(response, null, 2));

      // Extract all orderDetails at once
      const orderDetails: OrderDetail[] = response.result.orderDetails.map(
        (detail: any) => detail.orderDetail
      );

      const mappedOrderDetails: OrderDetails[] = orderDetails.map((detail) => ({
        orderDetail: detail,
        comboOrderDetails: [], // Add appropriate comboOrderDetails if available
      }));

      // Set the order details in state
      setOrderDetails(mappedOrderDetails);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  }, [orderId]);

  // Re-fetch order details when page is focused
  useFocusEffect(
    useCallback(() => {
      fetchOrderDetails();
    }, [fetchOrderDetails])
  );
  // Update dishes and combos based on orderDetails state change
  useEffect(() => {
    if (orderDetails.length > 0) {
      const fetchedCombos = orderDetails
        .filter((detail) => detail.orderDetail.combo)
        .map((detail) => detail.orderDetail as OrderDetail);

      const fetchedDishes = orderDetails
        .filter((detail) => detail.orderDetail.dishSizeDetail)
        .map((detail) => detail.orderDetail as OrderDetail);

      // Set dishes and combos
      setCombos(fetchedCombos);
      setDishes(fetchedDishes);
    }
  }, [orderDetails]);

  const groupOrders = (orders: UncheckedPrelistOrderDetail[]) => {
    const groupedDishes: Record<string, any> = {};
    const groupedCombos: Record<string, any> = {};

    orders.forEach((order) => {
      const { prelistOrder, comboOrderDetails } = order;

      if (prelistOrder.dishSizeDetail) {
        // Get dishId safely
        const dishId = prelistOrder.dishSizeDetailId ?? ""; // Default to an empty string if undefined
        if (dishId) {
          // Ensure dishId is not empty
          if (!groupedDishes[dishId]) {
            groupedDishes[dishId] = {
              ...prelistOrder,
              quantity: 0,
              timeArray: [],
            };
          }
          groupedDishes[dishId].quantity += prelistOrder.quantity;
          groupedDishes[dishId].timeArray.push(
            moment.utc(prelistOrder.orderTime).format("HH:mm:ss, DD/MM/YYYY")
          );
        }
      } else if (prelistOrder.combo) {
        // Construct comboKey safely
        const comboId = prelistOrder.comboId ?? ""; // Default to an empty string if undefined
        const comboKey =
          comboOrderDetails.length > 0
            ? `${comboId}_${comboOrderDetails
                .map((detail) => detail.dishComboId)
                .sort()
                .join("_")}`
            : comboId;

        if (comboKey) {
          // Ensure comboKey is not empty
          if (!groupedCombos[comboKey]) {
            groupedCombos[comboKey] = {
              ...prelistOrder,
              quantity: 0,
              timeArray: [],
              comboDetails: comboOrderDetails,
            };
          }
          groupedCombos[comboKey].quantity += prelistOrder.quantity;
          groupedCombos[comboKey].timeArray.push(
            moment.utc(prelistOrder.orderTime).format("HH:mm:ss, DD/MM/YYYY")
          );
        }
      }
    });

    return {
      dishes: Object.values(groupedDishes),
      combos: Object.values(groupedCombos),
    };
  };

  // Function to show modal with content
  const showModal = (content: any) => {
    setModalContent(content);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  const renderDishItem = ({ item }: { item: any }) => (
    <View style={{ width: itemWidth }}>
      <DishCardHistory
        dish={item}
        itemWidth={itemWidth}
        showModal={showModal}
      />
    </View>
  );

  const renderComboItem = ({ item }: { item: any }) => (
    <View style={{ width: itemWidth }}>
      <ComboCardHistory
        combo={item}
        comboDetails={item.comboDetails}
        itemWidth={itemWidth}
        showModal={showModal}
      />
    </View>
  );

  // Thêm các item rỗng vào cuối nếu cần thiết để luôn có đủ 4 item trên mỗi hàng
  const fillEmptySpaces = (data: any[]) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    const numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;

    if (numberOfElementsLastRow !== 0) {
      const emptySpaces = numColumns - numberOfElementsLastRow;
      for (let i = 0; i < emptySpaces; i++) {
        data.push({ empty: true });
      }
    }

    return data;
  };
  const dataDishWithEmptySpaces = fillEmptySpaces([...dishes]);
  const dataComboWithEmptySpaces = fillEmptySpaces([...combos]);

  return (
    <Provider>
      <View className="flex-1 py-4 px-4 bg-[#f9f9f9]">
        <View className="flex-row items-center justify-between mx-2 mb-4 mt-2">
          <Text className="text-[25px] font-bold uppercase pb-2 border-b-2 text-[#970C1A] border-[#970C1A]">
            Lịch sử đặt món của bạn
          </Text>
          <SearchBar />
        </View>

        {dataDishWithEmptySpaces.length > 0 ||
        dataDishWithEmptySpaces.length > 0 ? (
          <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
            {/* List of Dishes */}
            {dataDishWithEmptySpaces.length > 0 && (
              <View className="my-2">
                <Text className="text-xl font-bold ml-8 text-[#970C1A] uppercase">
                  Món lẻ:
                </Text>
                <FlatList
                  data={dataDishWithEmptySpaces}
                  renderItem={({ item }) => {
                    // Nếu item là rỗng, không render gì
                    if (item.empty) {
                      return (
                        <View
                          style={{ width: itemWidth, marginBottom: spacing }}
                        />
                      );
                    }

                    // Nếu item có dữ liệu, render bình thường
                    return (
                      <DishCardHistory
                        dish={item}
                        itemWidth={itemWidth}
                        showModal={showModal}
                      />
                    );
                  }}
                  keyExtractor={(item) =>
                    item.dishSizeDetailId || item.orderDetailId
                  }
                  numColumns={numColumns}
                  scrollEnabled={false}
                  columnWrapperStyle={{ marginHorizontal: spacing }}
                  contentContainerStyle={{ paddingHorizontal: spacing }}
                />
              </View>
            )}

            {/* List of Combos */}
            {dataComboWithEmptySpaces.length > 0 && (
              <View className="my-2">
                <Text className="text-xl font-bold ml-8 text-[#970C1A] uppercase">
                  Món Combo:
                </Text>
                <FlatList
                  data={dataComboWithEmptySpaces}
                  renderItem={({ item }) => {
                    // Nếu item là rỗng, không render gì
                    if (item.empty) {
                      return (
                        <View
                          style={{ width: itemWidth, marginBottom: spacing }}
                        />
                      );
                    }

                    // Nếu item có dữ liệu, render bình thường
                    return (
                      <ComboCardHistory
                        combo={item}
                        itemWidth={itemWidth}
                        showModal={showModal}
                        comboDetails={item?.comboDetails}
                      />
                    );
                  }}
                  keyExtractor={(item) => item.comboId || item.orderDetailId}
                  numColumns={numColumns}
                  scrollEnabled={false}
                  columnWrapperStyle={{ marginHorizontal: spacing }}
                  contentContainerStyle={{
                    paddingHorizontal: spacing,
                    marginTop: 16,
                  }}
                />
              </View>
            )}
          </ScrollView>
        ) : (
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
        )}

        {/* Modal to display details */}
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 8,
              width: "80%",
              margin: "auto",
              position: "relative",
            }}
          >
            {modalContent && (
              <View>
                <Text className="text-lg font-bold">
                  {modalContent.name || modalContent.dish?.name}
                </Text>
                <Text>
                  {modalContent.description || modalContent.dish?.description}
                </Text>
                <Text className="text-red-500 mt-2">
                  Giá: {modalContent.price} VND
                </Text>
              </View>
            )}
            <TouchableOpacity
              className="absolute top-3 right-3 rounded-full p-1"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
              onPress={hideModal}
            >
              <MaterialCommunityIcons
                name="window-close"
                size={30}
                color="gray"
              />
            </TouchableOpacity>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

export default HistoryOrderPanel;
