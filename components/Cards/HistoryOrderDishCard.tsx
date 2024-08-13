import React from "react";
import { Image, Text, View } from "react-native";

interface Dish {
  id: number;
  image: string | number; // URL or local image
  name: string;
  rating: number;
  ratingCount: number;
  type: string;
  price: string;
}

interface HistoryOrderCardProps {
  dish: Dish;
}

const HistoryOrderCard: React.FC<HistoryOrderCardProps> = ({ dish }) => {
  return (
    <View className="mb-2">
      <View className="flex-row justify-between pb-4 items-start my-2 ">
        <Image
          source={
            typeof dish.image === "string" ? { uri: dish.image } : dish.image
          }
          className="rounded-lg w-20 h-20"
        />
        <View className="flex-1 ml-5 ">
          <Text className="text-base font-semibold">{dish.name}</Text>
          <View className="flex-row items-center ">
            <Text className="text-sm mr-1">Số lượng: </Text>
            <Text className="text-sm font-semibold "> {dish.ratingCount}</Text>
          </View>
          <Text className="text-lg font-bold text-[#C01D2E]">{dish.price}</Text>
        </View>
      </View>
      <View
        style={{ borderBottomColor: "#a4a2a2", borderBottomWidth: 1 }}
        className="w-full mx-auto"
      />
    </View>
  );
};

export default HistoryOrderCard;
