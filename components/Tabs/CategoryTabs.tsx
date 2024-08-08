import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-2"
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => onSelectCategory(category)}
          className={`px-4 mx-2 py-2 border-2 rounded-lg ${
            selectedCategory === category
              ? "border-[#E45834]"
              : "border-gray-300"
          }`}
        >
          <Text
            className={`text-[18px] font-semibold ${
              selectedCategory === category ? "text-[#E45834]" : "text-gray-500"
            }`}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryTabs;
