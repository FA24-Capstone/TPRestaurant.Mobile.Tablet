import { fetchDishes } from "@/api/dishesApi";
import { Dish } from "@/app/types/dishes_type";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DishCard from "../Cards/DishCard";

interface ListDishesProps {
  isPanelOpen: boolean;
  selectedCategory: string;
  DishItemTypeTranslations: {
    [key: string]: string;
  };
}

const ListDishes: React.FC<ListDishesProps> = ({
  isPanelOpen,
  selectedCategory,
  DishItemTypeTranslations,
}) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(9);
  const [hasMore, setHasMore] = useState<boolean>(true);

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

  const filteredDishes =
    selectedCategory === "Tất cả"
      ? dishes
      : dishes.filter(
          (dish) =>
            DishItemTypeTranslations[dish.dishItemType.name] ===
            selectedCategory
        );

  return (
    <View>
      {filteredDishes.length > 0 && (
        <>
          <Text className="text-xl font-bold ml-8 text-[#970C1A] uppercase">
            Món lẻ:
          </Text>
          <View className="flex-row flex-wrap justify-start">
            {filteredDishes.map((dish) => (
              <View
                className={isPanelOpen ? "w-[30%] p-1 " : "w-[20%] p-1"}
                key={dish.id}
              >
                <DishCard
                  id={dish.id}
                  image={dish.image}
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
        </>
      )}

      {filteredDishes.length > 0 && hasMore && (
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
  );
};

export default ListDishes;