import React from "react";
import { FlatList, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import OrderItem from "./OrderItem";
import ComboOrderItem from "./ComboOrderItem";

const OrderItemList: React.FC = () => {
  const dishes = useSelector((state: RootState) => state.dishes.selectedDishes);
  const combos = useSelector((state: RootState) => state.dishes.selectedCombos);

  console.log("dishesOrdersNe", dishes);
  console.log("combosOrdersNe", combos);

  const combinedOrders = [
    ...dishes,
    ...combos.map((combo) => ({
      ...combo,
      id: combo.comboId, // Normalize id for keyExtractor
      type: "combo", // Add type for distinguishing in renderItem
    })),
  ];

  console.log("====================================");
  console.log("combinedOrdersNe", combinedOrders);
  console.log("====================================");
  return (
    <>
      {combos.length > 0 && (
        <FlatList
          data={combos}
          renderItem={({ item }) => <ComboOrderItem item={item} />}
          keyExtractor={(item) => `${item.comboId}_${item.selectedDishes}`} // Sử dụng sự kết hợp của id và size làm key
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      {dishes.length > 0 && (
        <FlatList
          data={dishes}
          renderItem={({ item }) => <OrderItem item={item} />}
          keyExtractor={(item) => `${item.id}_${item.size}`} // Sử dụng sự kết hợp của id và size làm key
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </>
  );
};

export default OrderItemList;
