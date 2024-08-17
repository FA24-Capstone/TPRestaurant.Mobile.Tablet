import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import SearchBar from "../SearchBar";
import CategoryTabs from "../Tabs/CategoryTabs";
import DishCard from "../Cards/DishCard";
import MarqueeText from "../MarqueeText";
import { Dish } from "@/app/types/dishes_type";
import { fetchDishes } from "@/api/dishesApi";

interface ListDishProps {
  isPanelOpen: boolean;
}

const ListDish: React.FC<ListDishProps> = ({ isPanelOpen }) => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log("dishesList", dishes);

  const categories = [
    "Tất cả",
    "Khai vị",
    "Súp",
    "Lẩu",
    "Nướng",
    "Tráng miệng",
    "Đồ uống",
    "Món ăn kèm",
    "Nước chấm",
    "Khác", // Thêm các loại khác nếu cần
  ];

  const DishItemTypeTranslations = {
    APPETIZER: "Khai vị",
    SOUP: "Súp",
    HOTPOT: "Lẩu",
    BBQ: "Nướng",
    HOTPOT_BROTH: "Nước lẩu",
    HOTPOT_MEAT: "Thịt cho lẩu",
    HOTPOT_SEAFOOD: "Hải sản cho lẩu",
    HOTPOT_VEGGIE: "Rau củ cho lẩu",
    BBQ_MEAT: "Thịt cho BBQ",
    BBQ_SEAFOOD: "Hải sản cho BBQ",
    HOTPOT_TOPPING: "Topping cho lẩu",
    BBQ_TOPPING: "Topping cho BBQ",
    SIDEDISH: "Món ăn kèm",
    DRINK: "Đồ uống",
    DESSERT: "Tráng miệng",
    SAUCE: "Nước chấm",
  };

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const fetchedDishes = await fetchDishes(); // Fetch dishes from the API
        setDishes(fetchedDishes);
      } catch (err) {
        setError("Failed to load dishes");
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, []);

  const filteredDishes =
    selectedCategory === "Tất cả"
      ? dishes
      : dishes.filter(
          (dish) =>
            DishItemTypeTranslations[dish.dishItemType.name] ===
            selectedCategory
        );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <MarqueeText />
      <View className="p-4 mx-2">
        <View className="flex-row items-center justify-between mx-2 mb-6 mt-2">
          <Text className="text-[28px] font-bold uppercase pb-4 border-b-2 text-[#970C1A] border-[#970C1A]">
            Thực đơn hôm nay
          </Text>
          <SearchBar />
        </View>
        <View className="flex-row justify-center mb-2">
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
                image={dish.image} // Assuming image is a URL
                name={dish.name}
                rating={dish.rating}
                ratingCount={dish.ratingCount}
                type={
                  DishItemTypeTranslations[dish.dishItemType.name] ||
                  "Loại không xác định"
                }
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
