import ListDish from "@/components/List/ListDish";
import React from "react";
import { View, Text } from "react-native";

const MenuScreen: React.FC = () => {
  return (
    <View className="flex-1">
      <ListDish />
    </View>
  );
};

export default MenuScreen;
