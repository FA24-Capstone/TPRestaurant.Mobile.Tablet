// src/components/OrderFooter.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

// Define the props interface
interface OrderFooterProps {
  note: string;
  setNote: (note: string) => void;
}

const OrderFooter: React.FC<OrderFooterProps> = ({ note, setNote }) => {
  return (
    <View className="px-4 py-2 border-t border-gray-400">
      <Text className="text-lg font-semibold text-gray-600 mb-2">
        Thêm ghi chú
      </Text>
      <TextInput
        placeholder="Nhập ghi chú (tối đa 70 ký tự)"
        value={note}
        onChangeText={setNote}
        maxLength={70}
        className="border border-gray-300 p-2 rounded mb-4"
      />
    </View>
  );
};

export default OrderFooter;
