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
  noteChild: { [key: string]: string }; // Thêm notes
  updateNote: (id: string, note: string) => void; // Thêm hàm cập nhật ghi chú
}

const OrderItemList: React.FC<ItemListOrder> = ({
  dishes,
  combos,
  noteChild,
  updateNote,
}) => {
  // Merge dishes and combos into a single array, distinguishing by type
  const combinedItems = [
    ...dishes.map((dish) => ({ ...dish, type: "dish" })), // Add type 'dish' to each dish item
    ...combos.map((combo) => ({ ...combo, type: "combo" })), // Add type 'combo' to each combo item
  ];
  // console.log("combinedItems", JSON.stringify(combinedItems));

  return (
    <FlatList
      data={combinedItems}
      renderItem={({ item }) => {
        if (item.type === "combo") {
          return (
            <ComboOrderItem
              item={item}
              note={noteChild[item.comboId] || ""}
              setNote={(note) => updateNote(item.comboId, note)}
            />
          ); // Render ComboOrderItem for combos
        } else if (item.type === "dish") {
          return (
            <OrderItem
              item={item}
              note={noteChild[item.id] || ""}
              setNote={(note) => updateNote(item.id, note)}
            />
          ); // Render OrderItem for dishes
        }
        return null;
      }}
      keyExtractor={(item) =>
        item.type === "combo" ? `${item.comboId}` : `${item.id}`
      }
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

export default OrderItemList;
