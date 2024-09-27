import React, { useEffect, useState } from "react";
import {
  View,
  Dimensions,
  Modal,
  Text,
  FlatList,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Menu from "@/components/List/Menu";
import { IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OrderingDetail from "./OrderingDetail";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { formatPriceVND } from "../Format/formatPrice";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

interface Dish {
  orderDetailsId: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  dishSize?: string;
  dishCombo?: {
    image: string;
    dishComboId: string;
    price: number;
    name: string;
  }[];
}

type RootStackParamList = {
  "history-order": undefined; // Add this line
};

const OrderPanel: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const dispatch: AppDispatch = useDispatch();
  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const fullScreenWidth = Dimensions.get("window").width;
  const drawerWidth = isPanelOpen ? fullScreenWidth * 0.35 : 0; // Chiếm 30% chiều rộng màn hình
  const listWidth = isPanelOpen ? fullScreenWidth * 0.65 : fullScreenWidth; // Chiều rộng còn lại hoặc toàn bộ

  const [isModalVisible, setIsModalVisible] = useState(true);
  const [orderedDishes, setOrderedDishes] = useState<Dish[]>([]);

  console.log("orderedDishesNe", JSON.stringify(orderedDishes, null, 2));

  useEffect(() => {
    const extractedDishes: Dish[] = [];
    if (
      reservationData &&
      reservationData.result &&
      reservationData.result.orderDishes
    ) {
      // Extract data from orderDishes
      reservationData.result.orderDishes.forEach((order) => {
        if (order.comboDish) {
          // Handle combo dish
          const comboDetails = order.comboDish.dishCombos.map((comboItem) => ({
            dishComboId: comboItem.dishComboId,
            image: comboItem.dishSizeDetail.dish.image,
            name: comboItem.dishSizeDetail.dish.name,
            price: comboItem.dishSizeDetail.price,
          }));

          extractedDishes.push({
            orderDetailsId: order.orderDetailsId,
            image: order.comboDish.combo.image, // Combo image
            name: order.comboDish.combo.name,
            price: order.comboDish.combo.price,
            quantity: order.quantity,
            dishCombo: comboDetails, // Adding combo details here
          });
        } else if (order.dishSizeDetail) {
          // Handle individual dish
          extractedDishes.push({
            orderDetailsId: order.orderDetailsId,
            image: order.dishSizeDetail.dish.image,
            name: order.dishSizeDetail.dish.name,
            price: order.dishSizeDetail.price,
            quantity: order.quantity,
            dishSize: order.dishSizeDetail.dishSize.vietnameseName,
          });
        }
      });

      setOrderedDishes(extractedDishes);
    }
  }, [reservationData]);

  const handleConfirmOrder = () => {
    // Close the modal first
    setIsModalVisible(false);
    // Navigate to the "history-order" screen
    navigation.navigate("history-order");
  };

  const handleModifyOrder = () => {
    // Simply close the modal
    setIsModalVisible(false);
  };

  const OrderDetails = () => (
    <View
      className={`flex-1 relative bg-white p-2 `}
      style={{ width: drawerWidth }}
    >
      <View>
        <IconButton
          icon={() => (
            <MaterialCommunityIcons name="arrow-right" size={25} color="gray" />
          )}
          onPress={() => setIsPanelOpen(false)}
          size={20}
          style={{
            position: "absolute",
            top: 8,
            left: -40,
            transform: [{ translateX: -15 }, { translateY: -15 }], // Shifts the button outside
            backgroundColor: "#fff",
            borderRadius: 25,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            zIndex: 999,
            elevation: 5,
          }}
        />
      </View>
      <OrderingDetail />
    </View>
  );

  console.log("isPanelOpen", isPanelOpen);

  // Split the orderedDishes into two columns for manual control over layout
  const splitDishesIntoColumns = (data: Dish[], numColumns: number) => {
    const columns: Dish[][] = [[], []];
    data.forEach((item, index) => {
      columns[index % numColumns].push(item);
    });
    return columns;
  };

  const columns = splitDishesIntoColumns(orderedDishes, 2); // Split into 2 columns

  return (
    <View className="flex-row flex-1 relative">
      <View style={{ width: listWidth }}>
        <Menu isPanelOpen={isPanelOpen} />
      </View>
      {!isPanelOpen && (
        <View className="absolute right-2 top-1/2 transform -translate-y-1/2  rounded-md bg-gray-300">
          <IconButton
            icon="drag-vertical" // Sử dụng biểu tượng hai sọc dọc
            onPress={() => setIsPanelOpen(true)}
            size={30}
          />
        </View>
      )}
      {isPanelOpen && <OrderDetails />}
      {/* Modal displaying the ordered dishes */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center p-5 bg-black/50">
          <View className="bg-white rounded-lg p-5 h-[600px]">
            <Text className="font-semibold text-xl text-center text-[#C01D2E] mb-1">
              Trong đơn đặt bàn bạn đã order các món dưới đây. Bạn hãy theo dõi
              món ăn đã chọn hoặc đặt thêm món nhé!
            </Text>

            <ScrollView contentContainerStyle={{ flexDirection: "row" }}>
              {columns.map((column, columnIndex) => (
                <View key={`column-${columnIndex}`} className="flex-1 p-2">
                  {column.map((item) => (
                    <View key={item.orderDetailsId}>
                      {item.dishSize && (
                        <View className="flex-row bg-[#EAF0F0] items-center w-full my-2.5 rounded-lg shadow p-2.5">
                          <Image
                            source={{ uri: item.image }}
                            className="h-20 w-20 rounded-md mr-4"
                          />
                          <View className="flex-1 flex-wrap flex-row justify-between items-center">
                            <View>
                              <Text className="text-lg font-semibold">
                                {item.name}
                              </Text>
                              <Text className="text-lg uppercase font-semibold text-gray-500">
                                {item.dishSize}
                              </Text>
                              <Text className="text-lg font-bold text-[#C01D2E]">
                                {item.price.toLocaleString()} VND
                              </Text>
                            </View>
                            <Text className="text-lg font-semibold mr-4">
                              Số lượng: {item.quantity} món
                            </Text>
                          </View>
                        </View>
                      )}

                      {item.dishCombo && item.dishCombo.length > 0 && (
                        <View className="flex-row bg-[#EAF0F0] w-full my-2.5 rounded-lg shadow p-2.5">
                          <Image
                            source={{ uri: item.image }}
                            className="h-20 w-20 rounded-md mr-4"
                          />
                          <View className="flex-row w-full justify-between">
                            <View className="flex-wrap w-[80%]  ">
                              <View className=" flex-row flex-wrap w-fit justify-between">
                                <Text className="text-lg font-bold ">
                                  {item.name}
                                </Text>
                                <Text className="text-lg font-semibold mr-4">
                                  Số lượng: {item.quantity} combo
                                </Text>
                              </View>
                              <Text className="text-lg font-bold text-[#C01D2E]">
                                {formatPriceVND(item.price)}
                              </Text>
                              <Text className="font-semibold mb-2">
                                Món đã chọn:
                              </Text>
                              <View className="flex-row flex-wrap gap-2">
                                {item.dishCombo.map((dish) => (
                                  <View
                                    key={dish.dishComboId}
                                    className="bg-white rounded-md p-2 shadow-md"
                                  >
                                    <Image
                                      source={{ uri: dish.image }}
                                      className="h-20 w-20 rounded-md mx-auto"
                                    />
                                    <Text className="text-center text-sm font-semibold">
                                      {dish.name}
                                    </Text>
                                    <Text className="text-center text-sm font-semibold text-red-600">
                                      {formatPriceVND(dish.price)}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>

            <View className="flex-row justify-evenly mt-5">
              <TouchableOpacity
                className="mt-4  bg-[#EDAA16] py-2 px-4 rounded-lg  mr-6"
                onPress={handleConfirmOrder}
              >
                <Text className="text-white text-center font-semibold text-lg uppercase">
                  Theo dõi món ăn{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="mt-4  py-2 px-4  bg-[#C01D2E] rounded-lg mr-6"
                onPress={handleModifyOrder}
              >
                <Text className="text-white  text-center font-semibold text-lg uppercase">
                  Đặt thêm món
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderPanel;
