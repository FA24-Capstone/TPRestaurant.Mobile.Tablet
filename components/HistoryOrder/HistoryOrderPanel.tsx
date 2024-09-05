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

const { width } = Dimensions.get("window");
const numColumns = 4;
const spacing = 8; // Margin on each side
const itemWidth = (width - (numColumns + 1) * spacing) / numColumns;

const HistoryOrderPanel: React.FC = () => {
  const [orders, setOrders] = useState<UncheckedPrelistOrderDetail[]>([]);

  const tableSession = useSelector(
    (state: RootState) => state.tableSession.currentSession
  );
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null); // State for modal content

  const tableSessionId = tableSession?.tableSessionId;
  console.log("orders nè", JSON.stringify(orders));

  useFocusEffect(
    useCallback(() => {
      if (tableSessionId) {
        const fetchData = async () => {
          try {
            const response = await fetchTableSessionById(tableSessionId);
            console.log(
              "Table session response:",
              JSON.stringify(response.result, null, 2)
            );

            const allOrders = [
              ...response.result.uncheckedPrelistOrderDetails,
              ...response.result.readPrelistOrderDetails,
              ...response.result.readyToServePrelistOrderDetails,
            ];
            setOrders(allOrders);
          } catch (error) {
            console.error("Error fetching table session:", error);
          }
        };
        fetchData();
      }
    }, [tableSessionId])
  );

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

  // Tách món ăn và combo sau khi nhóm
  const { dishes, combos } = groupOrders(orders);

  // // Separate dishes and combos
  // const dishes = orders.filter((item) => item.prelistOrder.dishSizeDetail);
  // const combos = orders.filter((item) => item.prelistOrder.combo);

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

  return (
    <Provider>
      <View className="flex-1 py-4 px-4 bg-[#f9f9f9]">
        <View className="flex-row items-center justify-between mx-2 mb-4 mt-2">
          <Text className="text-[25px] font-bold uppercase pb-2 border-b-2 text-[#970C1A] border-[#970C1A]">
            Lịch sử đặt món của bạn
          </Text>
          <SearchBar />
        </View>
        {dishes.length > 0 || combos.length > 0 ? (
          <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
            {/* List of Dishes */}
            {dishes.length > 0 && (
              <View className="my-2">
                <Text className="text-xl font-bold ml-8 text-[#970C1A] uppercase">
                  Món lẻ:
                </Text>
                <FlatList
                  data={dishes}
                  renderItem={renderDishItem}
                  keyExtractor={(item) => item.prelistOrderId}
                  numColumns={numColumns}
                  scrollEnabled={false}
                  columnWrapperStyle={{ marginHorizontal: spacing }}
                  contentContainerStyle={{ paddingHorizontal: spacing }}
                />
              </View>
            )}

            {/* List of Combos */}
            {combos.length > 0 && (
              <View className="my-2">
                <Text className="text-xl font-bold ml-8 text-[#970C1A] uppercase">
                  Món Combo:
                </Text>
                <FlatList
                  data={combos}
                  renderItem={renderComboItem}
                  keyExtractor={(item) => item?.prelistOrder?.prelistOrderId}
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
            {modalContent}
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
