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
  ActivityIndicator,
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
  const selectedDishes = useSelector(
    (state: RootState) => state.dishes.selectedDishes.length
  );

  const dispatch: AppDispatch = useDispatch();
  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const fullScreenWidth = Dimensions.get("window").width;
  const drawerWidth = isPanelOpen ? fullScreenWidth * 0.35 : 0; // Chiếm 30% chiều rộng màn hình
  const listWidth = isPanelOpen ? fullScreenWidth * 0.63 : fullScreenWidth; // Chiều rộng còn lại hoặc toàn bộ

  const [isModalVisible, setIsModalVisible] = useState(true);
  const [orderedDishes, setOrderedDishes] = useState<Dish[]>([]);

  // console.log("orderedDishesNe", JSON.stringify(orderedDishes, null, 2));

  useEffect(() => {
    const extractedDishes: Dish[] = [];
    // console.log("reservationDataNhe", reservationData);

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

  useEffect(() => {
    // console.log("isModalVisible Nha", isModalVisible);

    if (isModalVisible && orderedDishes.length > 0) {
      // Simulate data loading or preparation
      setIsLoading(true);
      // If you have actual data fetching, replace the timeout with your fetch logic
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Adjust based on actual data fetching
    }
  }, [isModalVisible]);

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
            <MaterialCommunityIcons
              name="arrow-right"
              size={25}
              color="white"
            />
          )}
          onPress={() => setIsPanelOpen(false)}
          size={20}
          style={{
            position: "absolute",
            top: 8,
            left: -40,
            transform: [{ translateX: -15 }, { translateY: -15 }], // Shifts the button outside
            backgroundColor: "#C01D2E",
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

  // console.log("isPanelOpen", isPanelOpen);

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
        <View className="absolute right-2 top-1/2 transform -translate-y-1/2  rounded-md bg-[#C01D2E]">
          <IconButton
            icon={() => (
              <MaterialCommunityIcons
                name="drag-vertical"
                size={30}
                color="white"
              />
            )} // Sử dụng biểu tượng hai sọc dọc
            onPress={() => setIsPanelOpen(true)}
            size={30}
          />
          {selectedDishes > 0 && (
            <Text className="absolute -top-2 -left-6 py-1 px-3 rounded-full text-base text-white font-extrabold bg-[#EDAA16]">
              {selectedDishes}
            </Text>
          )}
        </View>
      )}
      {isPanelOpen && <OrderDetails />}
    </View>
  );
};

export default OrderPanel;
