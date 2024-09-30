import HistoryOrderPanel from "@/components/HistoryOrder/HistoryOrderPanel";
import MarqueeText from "@/components/MarqueeText";
import React from "react";
import { View, Text } from "react-native";

const HistoryOrder: React.FC = () => {
  return (
    <View className="flex-1">
      {/* <MarqueeText /> */}
      <HistoryOrderPanel />
    </View>
  );
};

export default HistoryOrder;
