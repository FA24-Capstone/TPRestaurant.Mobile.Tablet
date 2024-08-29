import React from "react";
import { FlatList, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import OrderItem from "./OrderItem";
import ComboOrderItem from "./ComboOrderItem";
import { Combo } from "@/app/types/combo_type";

interface ItemListOrder {
  dishes: any[];
  combos: any[];
}

const OrderItemList: React.FC<ItemListOrder> = ({ dishes, combos }) => {
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
