import React from "react";
import { TextInput, View } from "react-native";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <View className="flex-row items-center w-[300px] bg-gray-200 rounded-lg p-2">
      <TextInput
        placeholder="Tìm món ăn..."
        className="flex-1"
        style={{ padding: 2 }} // Adjust padding
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
};

export default SearchBar;
