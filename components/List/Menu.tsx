import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import SearchBar from "../SearchBar";
import CategoryTabs from "../Tabs/CategoryTabs";
import DishCard from "../Cards/DishCard";
import MarqueeText from "../MarqueeText";
import { Dish } from "@/app/types/dishes_type";
import { fetchDishes } from "@/api/dishesApi";
import { Combo } from "@/app/types/combo_type";
import { fetchCombos } from "@/api/comboApi";
import ListCombo from "./ListCombo";
import ListDishes from "./ListDishes";
import LoadingOverlay from "../LoadingOverlay";

interface MenuProps {
  isPanelOpen: boolean;
}

const Menu: React.FC<MenuProps> = ({ isPanelOpen }) => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(9);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // **New State for Search Query**
  const [searchQuery, setSearchQuery] = useState<string>("");

  // console.log("dishesList", dishes);

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
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        const [fetchedDishes, fetchedCombos] = await Promise.all([
          fetchDishes(1, pageSize),
          fetchCombos(1, pageSize),
        ]);

        setDishes(fetchedDishes);
        setCombos(fetchedCombos);

        if (
          fetchedDishes.length < pageSize ||
          fetchedCombos.length < pageSize
        ) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (err) {
        console.error("Error loading menu items:", err); // Log the actual error
        setError("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, [pageSize]);

  if (loading) {
    // Use LoadingOverlay for initial loading
    return (
      <View style={{ flex: 1 }}>
        <LoadingOverlay visible={loading} />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }
  const shouldShowDishes = (category: string) => {
    if (category === "Tất cả") {
      return dishes.length > 0 || combos.length > 0;
    }

    const hasDishes = dishes.some(
      (dish) => DishItemTypeTranslations[dish.dishItemType.name] === category
    );
    const hasCombos = combos.some(
      (combo) => DishItemTypeTranslations[combo.category.name] === category
    );

    return hasDishes || hasCombos;
  };

  // Function to handle "Load More"

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      {/* <MarqueeText /> */}
      <View className="p-4 mx-2">
        <View className="flex-row items-center justify-between mx-2 mb-4 mt-2">
          <Text className="text-[25px] font-bold uppercase pb-2 border-b-2 text-[#970C1A] border-[#970C1A]">
            Thực đơn hôm nay
          </Text>
          {/* **Pass searchQuery and setSearchQuery to SearchBar** */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </View>
        <View className="flex-row justify-center mb-2">
          <CategoryTabs
            categories={categories.filter(shouldShowDishes)}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>
      </View>
      <ScrollView className="flex-1 bg-[#F9F9F9]">
        {/* {shouldShowDishes(selectedCategory) && ( */}
        <>
          <ListDishes
            isPanelOpen={isPanelOpen}
            selectedCategory={selectedCategory}
            DishItemTypeTranslations={DishItemTypeTranslations}
            searchQuery={searchQuery}
          />
          <ListCombo
            isPanelOpen={isPanelOpen}
            selectedCategory={selectedCategory}
            DishItemTypeTranslations={DishItemTypeTranslations}
            searchQuery={searchQuery}
          />
        </>
        {/* )} */}
      </ScrollView>
    </View>
  );
};

export default Menu;
