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
  // console.log("selectedDishesNe", selectedDishes);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchComboById(id);
        setComboDetails(data.result.combo);
        setDishCombos(data.result.dishCombo);
        const maxNum = Math.max(
          ...data.result.dishCombo.map(
            (item) => item.comboOptionSet.optionSetNumber
          )
        );
        console.log("maxNum", maxNum);

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
        dishCombos.find((set) => set.comboOptionSet.optionSetNumber === setId)
          ?.comboOptionSet.numOfChoice || 0;

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
          (combo) => combo.comboOptionSet.optionSetNumber === index + 1
        )[0]?.comboOptionSet.numOfChoice;
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
          .map((dishId) => {
            const dishDetail = dishCombos.find(
              (dish) => dish.dishCombo[0].dishComboId === dishId
            )?.dishCombo[0].dishSizeDetail;

            // Sử dụng dishId trực tiếp từ selectedDishes
            return dishDetail
              ? {
                  id: dishId, // Sử dụng id từ selectedDishes thay vì dishDetail.dishId
                  name: dishDetail.dish.name,
                  price: dishDetail.price,
                }
              : null;
          })
          .filter((detail) => detail !== null); // Ensure no null values are included
      }
    );

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
    return Array.from({ length: maxOptionSetNumber }, (_, index) => (
      <View key={index + 1} className="py-2">
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Bộ chọn {index + 1} (Chọn{" "}
          {
            dishCombos.find(
              (combo) => combo.comboOptionSet.optionSetNumber === index + 1
            )?.comboOptionSet.numOfChoice
          }{" "}
          món):
        </Text>
        <FlatList
          data={dishCombos.filter(
            (combo) => combo.comboOptionSet.optionSetNumber === index + 1
          )}
          horizontal
          renderItem={({ item }) => {
            const isSelected = selectedDishes[index + 1]?.includes(
              item.dishCombo[0].dishComboId
            );

            return (
              <TouchableOpacity
                key={item.dishCombo[0].dishComboId}
                style={{
                  margin: 10,
                  alignItems: "center",
                  position: "relative",
                }}
                onPress={() =>
                  handleDishSelection(index + 1, item.dishCombo[0].dishComboId)
                }
              >
                <Image
                  source={{ uri: item.dishCombo[0].dishSizeDetail.dish.image }}
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
                        top: 5, // Khoảng cách so với cạnh trên
                        // right: 5, // Khoảng cách so với cạnh phải
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
                  {item.dishCombo[0].dishSizeDetail.dish.name}
                </Text>
                <Text className="font-bold text-base text-center text-[#C01D2E]">
                  {formatPriceVND(item.dishCombo[0].dishSizeDetail.price)}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.dishCombo[0].dishComboId}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    ));
  };

  return (
    <View className="pt-24 m-2 overflow-hidden relative">
      <Image
        source={typeof image === "string" ? { uri: image } : image} // Handle both local and URL images
        className="absolute top-2 z-10 left-[20%] transform -translate-x-1/2 h-[130px] w-[130px] rounded-full border-2 p-2 border-black"
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
          className="border-[#E45834] border-2 p-2 rounded-[20px]  w-[60%] mx-auto mb-4 mt-2"
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
        <View className="h-[200px] flex-1 justify-center items-center bg-[#22222391] bg-opacity-50">
          <View
            style={{
              margin: 50,
              padding: 20,
            }}
            className=" bg-white rounded-lg"
          >
            <View className="flex-row bg-white w-[80%]  rounded-lg">
              <Image
                source={{
                  uri: typeof image === "string" ? image : String(image),
                }}
                style={{ height: 400, width: 400, resizeMode: "cover" }}
                className=" rounded-lg mr-6"
                resizeMode="cover"
              />
              <View>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>{name}</Text>
                <Text className="text-gray-600 text-lg font-semibold mr-4 mb-2">
                  {type} - {description}
                </Text>

                <Text className="font-bold  text-xl text-[#C01D2E] mb-4">
                  {formatPriceVND(price)}
                </Text>
                {dishCombos.length > 0 && (
                  <View>
                    <Text className="font-semibold text-xl">
                      Các lựa chọn món ăn:
                    </Text>

                    <ScrollView
                      style={{
                        backgroundColor: "white",
                        padding: 20,
                        marginBottom: 50,
                        height: 400,
                      }}
                    >
                      {renderOptionSets()}
                    </ScrollView>
                  </View>
                )}
                <View className=" flex-row justify-end">
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
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ComboCard;
