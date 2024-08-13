import React from "react";
import { View, Text } from "react-native";
import ListOrder from "../List/ListOrder";
import { Order } from "@/app/types";

const mockOrders: Order[] = [
  {
    date: "24/12/2023",
    id: 173826,
    dishes: [
      {
        id: 1,
        image: require("../../assets/banner/Banner1.jpg"), // Replace with actual image URL or local image
        name: "Sui cao nhân tôm thịt sốt Tứ Xuyên",
        rating: 4.5,
        ratingCount: 150,
        type: "Main",
        price: "200.000vnd",
      },
      {
        id: 2,
        image: require("../../assets/banner/Banner1.jpg"), // Replace with actual image URL or local image
        name: "Sui cao nhân tôm thịt sốt Tứ Xuyên",
        rating: 4.5,
        ratingCount: 150,
        type: "Main",
        price: "200.000vnd",
      },
      // Add more dishes as needed
    ],
    note: "Please deliver by 6 PM",
    status: "Delivered",
  },
  {
    date: "24/12/2023",
    id: 173827,
    dishes: [
      {
        id: 1,
        image: require("../../assets/banner/Banner1.jpg"), // Replace with actual image URL or local image
        name: "Sui cao nhân tôm thịt sốt Tứ Xuyên",
        rating: 4.5,
        ratingCount: 150,
        type: "Main",
        price: "200.000vnd",
      },
      {
        id: 2,
        image: require("../../assets/banner/Banner1.jpg"), // Replace with actual image URL or local image
        name: "Sui cao nhân tôm thịt sốt Tứ Xuyên",
        rating: 4.5,
        ratingCount: 150,
        type: "Main",
        price: "200.000vnd",
      },
      // Add more dishes as needed
    ],
    note: "Please deliver by 6 PM",
    status: "Delivered",
  },
  // Add more orders as needed
];

const HistoryOrderPanel: React.FC = () => {
  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View className="p-4 mx-2">
        <View className="flex-row items-center justify-between mx-2  mt-2">
          <Text className="text-[28px] font-bold uppercase pb-4 border-b-2 text-[#970C1A] border-[#970C1A]">
            Lịch sử đặt món của bạn
          </Text>
        </View>
      </View>
      <View className="px-4 m-2">
        <Text className="font-semibold text-xl mx-2">
          Tổng có {mockOrders.length} lần đặt món
        </Text>
      </View>
      <ListOrder orders={mockOrders} />
    </View>
  );
};

export default HistoryOrderPanel;
