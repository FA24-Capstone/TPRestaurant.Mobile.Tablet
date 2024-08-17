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

interface ListDishProps {
  isPanelOpen: boolean;
}

const ListDish: React.FC<ListDishProps> = ({ isPanelOpen }) => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(6);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [combos, setCombos] = useState<Combo[]>([]);
  const [loadingCombos, setLoadingCombos] = useState<boolean>(true);
  const [errorCombos, setErrorCombos] = useState<string | null>(null);
  const [comboPageSize, setComboPageSize] = useState<number>(6);
  const [hasMoreCombos, setHasMoreCombos] = useState<boolean>(true);

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
        const fetchedDishes = await fetchDishes(1, pageSize);
        setDishes(fetchedDishes);

        if (fetchedDishes.length < pageSize) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (err) {
        setError("Failed to load dishes");
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, [pageSize]);

  useEffect(() => {
    const loadCombos = async () => {
      try {
        const fetchedCombos = await fetchCombos(1, comboPageSize);
        setCombos(fetchedCombos);

        if (fetchedCombos.length < comboPageSize) {
          setHasMoreCombos(false);
        } else {
          setHasMoreCombos(true);
        }
      } catch (err) {
        setErrorCombos("Failed to load combos");
      } finally {
        setLoadingCombos(false);
      }
    };

    loadCombos();
  }, [comboPageSize]);

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

  const filteredCombos =
    selectedCategory === "Tất cả"
      ? combos
      : combos.filter(
          (combo) =>
            DishItemTypeTranslations[combo.category.name] === selectedCategory
        );

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <MarqueeText />
      <View className="p-4 mx-2">
        <View className="flex-row items-center justify-between mx-2 mb-4 mt-2">
          <Text className="text-[25px] font-bold uppercase pb-2 border-b-2 text-[#970C1A] border-[#970C1A]">
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
        <View>
          <Text className="text-xl font-bold ml-8 text-[#970C1A] uppercase">
            Món lẻ:
          </Text>
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
                  description={dish.description}
                  dishSizeDetails={dish.dishSizeDetails}
                />
              </View>
            ))}
          </View>
          {hasMore && (
            <View className="flex-row justify-center m-4">
              <TouchableOpacity
                className="bg-[#970C1A] p-2 rounded-lg  w-[140px]"
                onPress={() => setPageSize((prev) => prev + 10)}
              >
                <Text className="text-center text-white font-semibold">
                  Xem thêm
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View>
          <Text className="text-xl font-bold ml-8 text-[#970C1A] uppercase">
            COMBO:
          </Text>
          <View className="flex-row flex-wrap justify-start">
            {filteredCombos.map((combo) => (
              <View
                className={isPanelOpen ? "w-[30%] p-1 " : "w-[20%] p-1"}
                key={combo.comboId}
              >
                <DishCard
                  id={combo.comboId}
                  image={combo.image}
                  name={combo.name}
                  rating={4.5} // Placeholder value
                  ratingCount={100} // Placeholder value
                  type={
                    DishItemTypeTranslations[combo.category.name] ||
                    "Loại không xác định"
                  }
                  price={combo.price}
                  description={combo.description}
                  dishSizeDetails={[]} // Nếu không có dishSizeDetails, truyền mảng rỗng
                />
              </View>
            ))}
          </View>
          {hasMoreCombos && (
            <View className="flex-row justify-center m-4">
              <TouchableOpacity
                className="bg-[#970C1A] p-2 rounded-lg  w-[140px]"
                onPress={() => setComboPageSize((prev) => prev + 10)}
              >
                <Text className="text-center text-white font-semibold">
                  Xem thêm
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ListDish;
