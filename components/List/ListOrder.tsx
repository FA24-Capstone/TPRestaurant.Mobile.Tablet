import React from "react";
import { ScrollView, View } from "react-native";
import OrderHistoryItem from "../HistoryOrder/HistoryOrderItem";
import { ListOrderProps } from "@/app/types/dishes_type";

const ListOrder: React.FC<ListOrderProps> = ({ orders }) => {
  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] p-4 mx-2">
      <View>
        {orders.map((order, index) => (
          <OrderHistoryItem index={index} key={order.id} order={order} />
        ))}
      </View>
    </ScrollView>
  );
};

export default ListOrder;
