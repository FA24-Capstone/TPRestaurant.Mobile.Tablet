import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import {
  addOrUpdateCombo,
  addOrUpdateDish,
} from "../../redux/slices/dishesSlice";
import { DishSizeDetail } from "@/app/types/dishes_type";
import { formatPriceVND } from "../Format/formatPrice";
import { fetchComboById } from "@/api/comboApi";
import { Combo, DishCombo, DishComboDetail } from "@/app/types/combo_type";

interface SelectedDishes {
  [setId: number]: string[]; // Use number if setId is numeric
}
interface ComboCardProps {
  id: string;
  name: string;
  description?: string;
  image: number | string;
  price: number;
  rating: number;
  ratingCount: number;
  type: string;
}

const ComboCard: React.FC<ComboCardProps> = ({
  id,
  image,
  name,
  rating,
  ratingCount,
  type,
  price,
  description,
}) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [comboDetails, setComboDetails] = useState<Combo | null>(null);
  const [dishCombos, setDishCombos] = useState<DishCombo[]>([]);
  const [selectedDishes, setSelectedDishes] = useState<SelectedDishes>({});
  const [maxOptionSetNumber, setMaxOptionSetNumber] = useState(0);

  // console.log("maxOptionSetNumber", maxOptionSetNumber);
  // console.log("selectedDishesNe", JSON.stringify(selectedDishes, null, 2));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchComboById(id);
        setComboDetails(data.result.combo);
        setDishCombos(data.result.dishCombo);
        const maxNum = Math.max(
          ...data.result.dishCombo.map((item) => item?.optionSetNumber)
        );
        setMaxOptionSetNumber(maxNum);
      } catch (error) {
        console.error("Error fetching combo details:", error);
        alert("Failed to load combo details.");
      }
    };

    fetchData();
  }, [id]);

  const handleAddDish = async () => {
    try {
      const data = await fetchComboById(id);
      setComboDetails(data.result.combo);
      setDishCombos(data.result.dishCombo);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching combo details:", error);
      alert("Failed to load combo details.");
    }
  };

  const handleDishSelection = (setId, dishId) => {
    setSelectedDishes((prev) => {
      const currentSelection = prev[setId] || [];
      const maxChoices =
        dishCombos.find((set) => set.optionSetNumber === setId)?.numOfChoice ||
        0;

      if (currentSelection.includes(dishId)) {
        return {
          ...prev,
          [setId]: currentSelection.filter((id) => id !== dishId),
        };
      } else if (currentSelection.length < maxChoices) {
        return { ...prev, [setId]: [...currentSelection, dishId] };
      }
      return prev;
    });
  };

  const allChoicesMade = () => {
    return (
      Object.keys(selectedDishes).length === maxOptionSetNumber &&
      Object.values(selectedDishes).every((choices, index) => {
        const requiredChoices = dishCombos.filter(
          (combo) => combo.optionSetNumber === index + 1
        )[0]?.numOfChoice;
        return choices.length === requiredChoices;
      })
    );
  };

  const handleAddToOrder = () => {
    // Check if there are options to choose from and if all choices have been made
    if (dishCombos.length > 0 && !allChoicesMade()) {
      alert("Please complete all selections before adding to order.");
      return; // Exit early if not all choices are made
    }

    // Map selected dishes to their details
    // Map selected dishes to their details
    const selectedDishesDetails = Object.entries(selectedDishes).flatMap(
      ([setId, dishIds]) => {
        return dishIds
          ?.map((dishId) => {
            // Find the correct dish in the entire dishCombo array
            const dishDetail = dishCombos
              .find((combo) => combo.optionSetNumber === parseInt(setId)) // Find the right option set
              ?.dishCombo.find(
                (dish) => dish.dishComboId === dishId
              )?.dishSizeDetail;

            // Return the dish detail if found
            return dishDetail
              ? {
                  id: dishId, // Use dishId from selectedDishes
                  name: dishDetail.dish.name,
                  price: dishDetail.price,
                }
              : null;
          })
          .filter((detail) => detail !== null); // Ensure no null values are included
      }
    );

    // console.log("selectedDishesDetailsnhoa", selectedDishesDetails);

    // Prepare the order object based on the combo details and the selected dishes
    const dishComboOrder = {
      comboId: id,
      comboName: name,
      comboImage: image,
      comboPrice: price,
      selectedDishes: selectedDishesDetails,
      quantity: 1,
    };

    // Dispatch the order to the Redux store
    dispatch(addOrUpdateCombo(dishComboOrder));
    setModalVisible(false);
  };

  const closeModal = () => setModalVisible(false);

  const renderOptionSets = () => {
    return Array.from({ length: maxOptionSetNumber }, (_, index) => {
      const flattenedDishes = dishCombos
        .filter((combo) => combo.optionSetNumber === index + 1)
        .flatMap((item) => item.dishCombo);

      return (
        <View key={index + 1} className="py-2">
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Bộ chọn {index + 1} (Chọn{" "}
            {
              dishCombos.find((combo) => combo.optionSetNumber === index + 1)
                ?.numOfChoice
            }{" "}
            món):
          </Text>

          {/* Render the flattened list horizontally */}
          <FlatList
            data={flattenedDishes}
            horizontal
            renderItem={({ item: dish }) => {
              const isSelected = selectedDishes[index + 1]?.includes(
                dish.dishComboId
              );

              return (
                <TouchableOpacity
                  key={dish.dishComboId}
                  style={{
                    margin: 10,
                    alignItems: "center",
                    position: "relative",
                  }}
                  onPress={() =>
                    handleDishSelection(index + 1, dish.dishComboId)
                  }
                >
                  <Image
                    source={{ uri: dish.dishSizeDetail.dish.image }}
                    style={{ height: 100, width: 100, borderRadius: 10 }}
                  />
                  {isSelected && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                      }}
                    >
                      <View
                        style={{
                          position: "absolute",
                          top: 5,
                          backgroundColor: "#ffffff",
                          padding: 5,
                          borderRadius: 10,
                        }}
                      >
                        <Icon name="check" size={20} color="#C01D2E" />
                      </View>
                    </View>
                  )}
                  <Text className="font-semibold text-gray-600 text-base my-1 ">
                    {dish.dishSizeDetail.dish.name}
                  </Text>
                  <Text className="font-bold text-base text-center text-[#C01D2E]">
                    {formatPriceVND(dish.dishSizeDetail.price)}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.dishComboId}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      );
    });
  };

  return (
    <TouchableOpacity
      onPress={handleAddDish}
      className="pt-24 m-2 overflow-hidden w-full relative"
    >
      <Image
        source={typeof image === "string" ? { uri: image } : image} // Handle both local and URL images
        className="absolute  top-2 z-10 left-[18%] transform -translate-x-1/2 h-[130px] w-[130px] rounded-full border-2 p-2 border-black"
        resizeMode="cover"
      />
      <View className="pt-14 rounded-[16px] z-0 shadow-xl bg-[#FFF1E1]">
        <Text className="font-bold mx-2 text-[20px] text-center h-[50px]">
          {name}
        </Text>
        <Text className="text-gray-500 text-center mb-2">{type}</Text>
        <View className="flex-row items-center mx-auto mb-2">
          <Icon name="star" size={20} color="#FFD700" />
          <Text className=" text-gray-500 ml-1 font-semibold">{rating}</Text>
          <Text className="text-gray-500 ml-1 font-semibold">
            ({ratingCount})
          </Text>
        </View>
        <Text className="font-bold text-lg text-center text-[#C01D2E]">
          {formatPriceVND(price)}
        </Text>
        <TouchableOpacity
          className="border-[#E45834] border-2 p-2 rounded-[20px]  w-[80%] mx-auto mb-4 mt-2"
          onPress={handleAddDish}
        >
          <Text className="text-[#E45834] text-center font-bold text-lg">
            Chọn món này
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="h-[200px] flex-1 w-full justify-center items-center bg-[#22222391] bg-opacity-50">
          <View className=" bg-white p-4 w-fit rounded-lg ">
            <View className="flex-row bg-white min-w-[70%]  rounded-lg">
              <Image
                source={{
                  uri: typeof image === "string" ? image : String(image),
                }}
                style={{ height: 400, width: 400, resizeMode: "cover" }}
                className=" rounded-lg mr-6"
                resizeMode="cover"
              />
              <ScrollView
                className="flex-wrap w-1/2"
                style={{
                  backgroundColor: "white",

                  height: 500,
                }}
              >
                <Text className="font-bold text-2xl h-[50px]  text-gray-700 w-full">
                  {name}
                </Text>
                <Text className="text-gray-600 text-lg font-semibold mr-4 mb-2 max-w-[550px]">
                  {type} - {description}
                </Text>

                <Text className="font-bold  text-xl text-[#C01D2E] h-[40px] mb-4">
                  {formatPriceVND(price)}
                </Text>
                {dishCombos.length > 0 && (
                  <View>
                    <Text className="font-semibold text-xl">
                      Các lựa chọn món ăn:
                    </Text>

                    <View
                      style={{
                        backgroundColor: "white",
                        padding: 20,
                        marginBottom: 50,
                        // height: 400,
                      }}
                    >
                      {renderOptionSets()}
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
            <View className=" flex-row flex-wrap justify-end">
              <TouchableOpacity
                className="mt-4 bg-gray-500 p-2 rounded-lg w-[100px] mr-6"
                onPress={closeModal}
              >
                <Text className="text-white text-center font-semibold text-lg uppercase">
                  Huỷ
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="mt-4 bg-[#C01D2E] w-[200px] p-2 rounded-lg"
                // onPress={handleAddToOrder}
                onPress={handleAddToOrder}
                // disabled={!allChoicesMade()}
              >
                <Text className="text-white text-center font-semibold text-lg uppercase">
                  Thêm vào order
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default ComboCard;
