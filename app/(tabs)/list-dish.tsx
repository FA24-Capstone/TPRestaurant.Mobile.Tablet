import ListDish from "@/components/List/ListDish";
import OrderPanel from "@/components/Order/OrderPanel";
import React from "react";
import { View, Text } from "react-native";

const MenuScreen: React.FC = () => {
  return (
    <View className="flex-1">
      <OrderPanel />
    </View>
  );
};

export default MenuScreen;
