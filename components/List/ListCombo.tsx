import { fetchCombos } from "@/api/comboApi";
import { Combo } from "@/app/types/combo_type";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ComboCard from "../Cards/ComboCard";
import { ActivityIndicator } from "react-native";

interface ListComboProps {
  isPanelOpen: boolean;
  selectedCategory: string;
  DishItemTypeTranslations: {
    [key: string]: string;
  };
  searchQuery: string; // **Added Prop**
}

const ListCombo: React.FC<ListComboProps> = ({
  isPanelOpen,
  DishItemTypeTranslations,
  selectedCategory,
  searchQuery,
}) => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loadingCombos, setLoadingCombos] = useState<boolean>(true);
  const [errorCombos, setErrorCombos] = useState<string | null>(null);
  const [comboPageSize, setComboPageSize] = useState<number>(9);
  const [hasMoreCombos, setHasMoreCombos] = useState<boolean>(true);
  const [loadingMoreCombos, setLoadingMoreCombos] = useState<boolean>(false);

  // console.log("combosList", combos);

  useEffect(() => {
    const loadCombos = async () => {
      try {
        setLoadingCombos(true);
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

  const loadMoreCombos = async () => {
    try {
      setLoadingMoreCombos(true);
      const fetchedCombos = await fetchCombos(
        combos.length / comboPageSize + 1,
        comboPageSize
      );
      setCombos((prevCombos) => [...prevCombos, ...fetchedCombos]);

      if (fetchedCombos.length < comboPageSize) {
        setHasMoreCombos(false);
      }
    } catch (err) {
      setErrorCombos("Failed to load more combos");
    } finally {
      setLoadingMoreCombos(false);
    }
  };

  // **Apply Filtering Based on Search Query**
  const filteredCombos = combos.filter((combo) => {
    const matchesCategory =
      selectedCategory === "Tất cả" ||
      DishItemTypeTranslations[combo.category.name] === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      combo.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <View>
      {filteredCombos.length > 0 && (
        <>
          <Text className="text-xl font-bold ml-8 text-[#970C1A] uppercase">
            COMBO:
          </Text>
          <View className="flex-row flex-wrap justify-start">
            {filteredCombos.map((combo) => (
              <View
                className={isPanelOpen ? "w-[30%] p-1 " : "w-[20%] p-1"}
                key={combo.comboId}
              >
                <ComboCard
                  id={combo.comboId}
                  image={combo.image}
                  name={combo.name}
                  rating={combo.rating || 0} // Placeholder value
                  ratingCount={combo.ratingCount || 0} // Placeholder value
                  type={
                    DishItemTypeTranslations[combo.category.name] ||
                    "Loại không xác định"
                  }
                  price={combo.price}
                  description={combo.description}
                />
              </View>
            ))}
          </View>
        </>
      )}

      {filteredCombos.length > 0 && hasMoreCombos && (
        <View className="flex-row justify-center m-4">
          {loadingMoreCombos ? (
            <ActivityIndicator size="large" color="#A31927" />
          ) : (
            <TouchableOpacity
              className="bg-[#970C1A] p-2 rounded-lg w-[140px]"
              onPress={loadMoreCombos}
            >
              <Text className="text-center text-white font-semibold">
                Xem thêm
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default ListCombo;
