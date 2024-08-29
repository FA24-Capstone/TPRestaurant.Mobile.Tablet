import { fetchCombos } from "@/api/comboApi";
import { Combo } from "@/app/types/combo_type";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ComboCard from "../Cards/ComboCard";

interface ListComboProps {
  isPanelOpen: boolean;
  selectedCategory: string;
  DishItemTypeTranslations: {
    [key: string]: string;
  };
}

const ListCombo: React.FC<ListComboProps> = ({
  isPanelOpen,
  DishItemTypeTranslations,
  selectedCategory,
}) => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loadingCombos, setLoadingCombos] = useState<boolean>(true);
  const [errorCombos, setErrorCombos] = useState<string | null>(null);
  const [comboPageSize, setComboPageSize] = useState<number>(9);
  const [hasMoreCombos, setHasMoreCombos] = useState<boolean>(true);

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

  const filteredCombos =
    selectedCategory === "Tất cả"
      ? combos
      : combos.filter(
          (combo) =>
            DishItemTypeTranslations[combo.category.name] === selectedCategory
        );

  // console.log("filteredCombos", filteredCombos);

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
                  rating={4.5} // Placeholder value
                  ratingCount={100} // Placeholder value
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
          <TouchableOpacity
            className="bg-[#970C1A] p-2 rounded-lg  w-[140px]"
            onPress={() => setComboPageSize((prev) => prev + 9)}
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

export default ListCombo;
