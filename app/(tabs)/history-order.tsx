import HistoryOrderPanel from "@/components/HistoryOrder/HistoryOrderPanel";
import React from "react";
import { View, Text } from "react-native";

const HistoryOrder: React.FC = () => {
  return (
    <View className="flex-1">
      <HistoryOrderPanel />
    </View>
  );
};

export default HistoryOrder;
