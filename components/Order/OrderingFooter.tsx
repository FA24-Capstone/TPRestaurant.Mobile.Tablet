// src/components/OrderFooter.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const OrderFooter: React.FC = () => {
  const [note, setNote] = useState("");

  const handleOrderNow = () => {
    // Logic to handle the order
    console.log("Order placed with note:", note);
  };

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
      <TouchableOpacity
        onPress={handleOrderNow}
        className="bg-[#C01D2E] p-3 rounded-md"
      >
        <Text className="text-white text-center text-lg font-bold uppercase">
          Đặt món ngay
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderFooter;
