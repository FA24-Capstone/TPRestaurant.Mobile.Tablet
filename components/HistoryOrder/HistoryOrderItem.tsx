import React from "react";
import { View, Text, Image, Button, TouchableOpacity } from "react-native";
import HistoryOrderCard from "../Cards/HistoryOrderDishCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { OrderHistoryItemProps } from "@/app/types";

const OrderHistoryItem: React.FC<OrderHistoryItemProps> = ({
  order,
  index,
}) => {
  console.log("order", order);

  return (
    <View className=" bg-white my-2 p-4 rounded-lg shadow flex-row w-full">
      <Text className="text-lg font-bold">#{index + 1}</Text>
      <View className="w-full">
        <View className="flex-row justify-between mx-4">
          <View className="flex-row ">
            <MaterialCommunityIcons name="calendar" size={30} color="gray" />
            <Text className="text-lg font-semibold mb-4 ml-2 text-gray-500">
              12:00 PM , {order.date}
            </Text>
            <Text className="text-lg font-semibold mb-4 ml-2 text-gray-800">
              | ID {order.id}
            </Text>
          </View>
          <TouchableOpacity className="bg-[#7EBF9C] rounded  px-4 py-1 flex-row items-center">
            <Text className="text-lg font-semibold text-white">
              {order.status}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap justify-around">
          {order.dishes.slice(0, 2).map((dish) => (
            <View className="w-[45%] p-1 " key={dish.id}>
              <HistoryOrderCard dish={dish} key={dish.id} />
            </View>
          ))}
        </View>
        {order.dishes.length > 2 && (
          <Text className="text-[#C76B75] text-base text-center my-3 font-semibold">
            + {order.dishes.length - 2} món khác
          </Text>
        )}
        <View className="flex-row justify-evenly mt-2">
          <TouchableOpacity
            className=" bg-gray-600 px-7 py-3 rounded-md items-center flex-row"
            onPress={() => console.log("Detail")}
          >
            <Text className="text-white uppercase text-base font-semibold">
              Xem chi tiết
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#C01D2E] px-7 py-2 rounded-md items-center flex-row"
            onPress={() => console.log("Order Again")}
          >
            <Text className="text-white uppercase text-base font-semibold">
              Đặt món lại
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OrderHistoryItem;
