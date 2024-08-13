import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import OrderItemList from "./OrderItemList";
import { clearDishes } from "@/redux/slices/dishesSlice";
import OrderFooter from "./OrderingFooter";

const OrderingDetail: React.FC = () => {
  const selectedDishes = useSelector(
    (state: RootState) => state.dishes.selectedDishes
  );

  const dispatch = useDispatch();

  const handleClearAll = () => {
    dispatch(clearDishes()); // Dispatch the action to clear all dishes
  };

  return (
    <View className="flex-1 px-2 bg-white">
      <View className="border-b border-gray-400 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold mb-1 text-gray-600">
            MÃ ĐƠN ĐẶT MÓN :
          </Text>
          <Text className="font-bold text-lg text-gray-600">#12564878</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="account" size={24} color="gray" />
            <Text className="text-gray-600 mr-3 ml-2 font-semibold">
              GUEST:
            </Text>
            <Text className="text-[#EDAA16] text-xl font-semibold">2</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="table-furniture"
              size={24}
              color="gray"
            />
            <Text className="text-gray-600 mr-3 ml-2 font-semibold">
              TABLE:
            </Text>
            <Text className="text-[#EDAA16] text-xl font-semibold">001</Text>
          </View>
        </View>
      </View>
      {selectedDishes.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../../assets/Icons/NoProduct.png")}
            className="w-40 h-40"
            resizeMode="contain"
          />
          <Text className="text-gray-700 text-xl text-center my-6 w-3/5 uppercase">
            No products in this moment added
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <TouchableOpacity onPress={handleClearAll}>
            <Text className="italic text-right text-[#E45834] my-1 font-semibold">
              Clear All
            </Text>
          </TouchableOpacity>
          <OrderItemList />
          <View>
            <OrderFooter />
          </View>
        </View>
      )}
    </View>
  );
};

export default OrderingDetail;
