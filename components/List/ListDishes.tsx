import { fetchDishes } from "@/api/dishesApi";
import { Dish } from "@/app/types/dishes_type";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import DishCard from "../Cards/DishCard";
import LoadingOverlay from "../LoadingOverlay";

interface ListDishesProps {
  isPanelOpen: boolean;
  selectedCategory: string;
  DishItemTypeTranslations: {
    [key: string]: string;
  };
  searchQuery: string; // **Added Prop**
}

const ListDishes: React.FC<ListDishesProps> = ({
  isPanelOpen,
  selectedCategory,
  DishItemTypeTranslations,
  searchQuery,
}) => {
  // console.log("ListDishes component rendered");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(9);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const loadDishes = async () => {
      try {
        // console.log("filteredDishesNe");
        setLoading(true);

        const fetchedDishes = await fetchDishes(1, pageSize);
        setDishes(fetchedDishes);

        if (fetchedDishes.length <= pageSize) {
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

  const loadMoreDishes = async () => {
    try {
      setLoadingMore(true);
      const fetchedDishes = await fetchDishes(
        dishes.length / pageSize + 1,
        pageSize
      );
      setDishes((prevDishes) => [...prevDishes, ...fetchedDishes]);

      if (fetchedDishes.length < pageSize) {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to load more dishes");
    } finally {
      setLoadingMore(false);
    }
  };

  // **Apply Filtering Based on Search Query**
  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory =
      selectedCategory === "Tất cả" ||
      DishItemTypeTranslations[dish.dishItemType.name] === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      dish.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {loading ? (
        <LoadingOverlay visible={loading} />
      ) : (
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
                      rating={dish.rating || 0}
                      ratingCount={dish.ratingCount || 0}
                      type={
                        DishItemTypeTranslations[dish.dishItemType.name] ||
                        "Loại không xác định"
                      }
                      price={dish.price || 0}
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
              {loadingMore ? (
                <ActivityIndicator size="large" color="#A31927" />
              ) : (
                <TouchableOpacity
                  className="bg-[#970C1A] p-2 rounded-lg w-[140px]"
                  onPress={loadMoreDishes}
                >
                  <Text className="text-center text-white font-semibold">
                    Xem thêm
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default ListDishes;
