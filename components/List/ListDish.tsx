import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import SearchBar from "../SearchBar";
import CategoryTabs from "../Tabs/CategoryTabs";
import DishCard from "../Cards/DishCard";

interface ListDishProps {
  isPanelOpen: boolean;
}

const ListDish: React.FC<ListDishProps> = ({ isPanelOpen }) => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const categories = [
    "Tất cả",
    "Món Chiên",
    "Lẩu",
    "Nướng",
    "Tráng miệng",
    "Khác",
  ];

  // Giả sử bạn có dữ liệu cho các món ăn
  const dishes = [
    {
      id: 1,
      image: require("../../assets/banner/Banner1.jpg"),
      name: "Món Chiên 1",
      rating: 4.5,
      ratingCount: 20,
      type: "Món Chiên",
      price: "50.000 VNĐ",
    },
    {
      id: 2,
      image: require("../../assets/banner/Banner1.jpg"),
      name: "Món Chiên 2",
      rating: 4.5,
      ratingCount: 20,
      type: "Món Chiên",
      price: "50.000 VNĐ",
    },
    {
      id: 3,
      image: require("../../assets/banner/Banner1.jpg"),
      name: "Món Chiên 3",
      rating: 4.5,
      ratingCount: 20,
      type: "Món Chiên",
      price: "50.000 VNĐ",
    },
    {
      id: 4,
      image: require("../../assets/banner/Banner1.jpg"),
      name: "Món Chiên 4",
      rating: 4.5,
      ratingCount: 20,
      type: "Món Chiên",
      price: "50.000 VNĐ",
    },
    {
      id: 5,
      image: require("../../assets/banner/Banner1.jpg"),
      name: "Món Chiên 5",
      rating: 4.5,
      ratingCount: 20,
      type: "Món Chiên",
      price: "50.000 VNĐ",
    },
    {
      id: 6,
      image: require("../../assets/banner/Banner1.jpg"),
      name: "Món Lẩu 1",
      rating: 4.5,
      ratingCount: 20,
      type: "Lẩu",
      price: "50.000 VNĐ",
    },
    {
      id: 7,
      image: require("../../assets/banner/Banner1.jpg"),
      name: "Món Nướng 1",
      rating: 4.5,
      ratingCount: 20,
      type: "Nướng",
      price: "50.000 VNĐ",
    },
    // ... thêm các món ăn khác
  ];

  const filteredDishes =
    selectedCategory === "Tất cả"
      ? dishes
      : dishes.filter((dish) => dish.type === selectedCategory);

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View className="p-4 mx-2">
        <View className="flex-row items-center justify-between mx-2 mb-6 mt-2">
          <Text className="text-[28px] font-bold uppercase pb-4 border-b-2 text-[#970C1A] border-[#970C1A]">
            Thực đơn hôm nay
          </Text>
          <SearchBar />
        </View>
        <View className="flex-row justify-center mb-5">
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>
      </View>
      <ScrollView className="flex-1 bg-[#F9F9F9]">
        <View className="flex-row flex-wrap justify-start">
          {filteredDishes.map((dish) => (
            <View
              className={isPanelOpen ? "w-[30%] p-1 " : "w-[20%] p-1"} // 30% nếu panel mở, 50% nếu panel đóng
              key={dish.id}
            >
              <DishCard
                id={dish.id}
                image={dish.image}
                name={dish.name}
                rating={dish.rating}
                ratingCount={dish.ratingCount}
                type={dish.type}
                price={dish.price}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ListDish;
