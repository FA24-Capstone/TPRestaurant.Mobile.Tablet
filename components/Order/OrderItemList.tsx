import React from "react";
import { FlatList, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import OrderItem from "./OrderItem";

const OrderItemList: React.FC = () => {
  const dishes = useSelector((state: RootState) => state.dishes.selectedDishes);

  return (
    <FlatList
      data={dishes}
      renderItem={({ item }) => <OrderItem item={item} />}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 20 }} // Ensure there is enough padding for scrolling
    />
  );
};

export default OrderItemList;
