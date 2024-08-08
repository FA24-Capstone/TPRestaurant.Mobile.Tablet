import React from "react";
import { TextInput, View } from "react-native";

const SearchBar: React.FC = () => {
  return (
    <View className="flex-row items-center w-1/3  bg-gray-200 rounded-lg p-2">
      <TextInput
        placeholder="Tìm món ăn..."
        className="flex-1"
        style={{ padding: 4 }} // Điều chỉnh padding
      />
    </View>
  );
};

export default SearchBar;
