import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { useDispatch } from "react-redux";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  addOrUpdateDish,
  removeDishItem,
  removeDishQuanti,
} from "../../redux/slices/dishesSlice";
import { formatPriceVND } from "../Format/formatPrice";
import { Dish, DishSizeDetail } from "@/app/types/dishes_type";
import { showErrorMessage } from "../FlashMessageHelpers";
// import { DishOrder } from "@/app/types/order_type";

interface DishOrder extends Omit<Dish, "dishSizeDetails"> {
  quantity: number;
  selectedSizeDetail: DishSizeDetail;
}

interface OrderItemProps {
  item: DishOrder;
  note: string; // Thay noteChild bằng note
  setNote: (note: string) => void; // Thay setNoteChild bằng setNote
}

const OrderItem: React.FC<OrderItemProps> = ({ item, note, setNote }) => {
  const dispatch = useDispatch();
  const translateX = useSharedValue(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newNote, setNewNote] = useState(note); // State cho ghi chú mới

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Set the active offset for the gesture
    .simultaneousWithExternalGesture() // Allow simultaneous gestures
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (translateX.value < -50) {
        translateX.value = withSpring(-90, { stiffness: 300 });
      } else {
        translateX.value = withSpring(0, { stiffness: 300 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleRemoveQuantity = () => {
    dispatch(
      removeDishQuanti({
        dishId: item.id,
        selectedSizeId: item.selectedSizeDetail.dishSizeDetailId,
      })
    );
  };

  const handleRemoveDish = () => {
    dispatch(
      removeDishItem({
        dishId: item.id,
        selectedSizeId: item.selectedSizeDetail.dishSizeDetailId,
      })
    );
  };

  // Translation function
  const translateSize = (size: string) => {
    switch (size) {
      case "SMALL":
        return "Nhỏ";
      case "MEDIUM":
        return "Vừa";
      case "LARGE":
        return "Lớn";
      default:
        return size; // If none matches, return the original value
    }
  };

  const renderRightActions = () => (
    <TouchableOpacity
      onPress={handleRemoveDish}
      className="bg-[#C01D2E] justify-center items-center rounded-md px-6 h-full"
    >
      <Image
        source={require("../../assets/Icons/Trash.jpeg")}
        className="w-6 h-6"
      />
    </TouchableOpacity>
  );
  // console.log("itemOrdeingDish", item.selectedSizeDetail.quantityLeft);

  const openModal = () => {
    setModalVisible(true); // Mở modal khi nhấn vào nút chỉnh sửa
  };

  const saveNote = () => {
    setNote(newNote); // Lưu ghi chú mới vào state ngoài
    setModalVisible(false); // Đóng modal
  };

  return (
    <GestureDetector gesture={gesture}>
      <View className="flex-row rounded-lg overflow-hidden items-center justify-between">
        <Animated.View
          className=" bg-[#f8efe6] w-full my-2.5 rounded-lg shadow p-2.5"
          style={animatedStyle}
        >
          <View className="w-full flex-row">
            <View className=" w-[22%]">
              <Image
                source={
                  typeof item.image === "string"
                    ? { uri: item.image }
                    : item.image
                }
                className="h-20 w-20 rounded-md mr-4"
              />
            </View>
            <View className="flex-row items-center justify-between w-[78%]">
              <View className="h-[100%]">
                <Text className="flex-1 text-lg font-semibold h-[20px] mr-2.5">
                  {item.name.length > 15
                    ? `${item.name.substring(0, 15)}...`
                    : item.name}
                </Text>
                <Text className="text-lg uppercase font-semibold text-gray-500">
                  {translateSize(item.selectedSizeDetail.dishSize.name)}
                </Text>
                <Text className="text-lg font-bold text-[#C01D2E]">
                  {formatPriceVND(item?.price ?? 0)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="items-center mr-4">
                  <Text className="text-base">Số lượng:</Text>
                  <View className="flex-row items-center my-2 px-2 py-1 bg-white rounded-full">
                    <TouchableOpacity
                      onPress={handleRemoveQuantity}
                      className="p-1"
                    >
                      <MaterialCommunityIcons
                        name="minus-circle"
                        size={24}
                        color="#FFB0B0"
                      />
                    </TouchableOpacity>
                    <Text className="text-lg mx-2">{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          item.quantity < item.selectedSizeDetail.quantityLeft
                        ) {
                          dispatch(
                            addOrUpdateDish({
                              dish: {
                                ...item,
                                dishSizeDetails: [item.selectedSizeDetail], // Adding required dishSizeDetails array
                                dishItemTypeId: 0, // Placeholder value, update accordingly
                                dishItemType: {
                                  id: 0,
                                  name: "",
                                  vietnameseName: null,
                                }, // Placeholder value, update accordingly
                              },
                              selectedSizeId:
                                item.selectedSizeDetail.dishSizeDetailId,
                            })
                          );
                        } else {
                          showErrorMessage(
                            `Xin lỗi quý khách, hiện món này chỉ còn ${item.selectedSizeDetail.quantityLeft} món`
                          );
                        }
                      }}
                      className="p-1"
                    >
                      <MaterialCommunityIcons
                        name="plus-circle"
                        size={24}
                        color="#FFB0B0"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={openModal}>
                  <FontAwesome name="pencil-square" size={30} color="#EDAA16" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Hiển thị ghi chú dưới món ăn */}
          {note && (
            <Text className="text-gray-600 ml-2 font-semibold  mt-2">
              Ghi chú:{"  "}
              <Text className="text-[#EDAA16] ">{note}</Text>
            </Text>
          )}
        </Animated.View>
        <Animated.View className="ml-5 w-14 h-14" style={animatedStyle}>
          {renderRightActions()}
        </Animated.View>

        {/* Modal nhập ghi chú */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
            <View className="bg-white py-6 px-10 rounded-lg w-[500px]">
              <Text className="text-xl font-bold text-[#902933]">
                Nhập ghi chú
              </Text>
              <TextInput
                value={newNote}
                onChangeText={setNewNote}
                placeholder="Nhập ghi chú (tối đa 40 ký tự)"
                maxLength={40}
                className="border-2 my-2 font-semibold text-base border-gray-300 rounded-md p-2 mt-4"
              />
              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="px-4 py-2 w-[45%] bg-gray-300 rounded"
                >
                  <Text className="font-semibold text-base text-center uppercase">
                    Hủy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveNote}
                  className="px-4 py-2 w-[45%] bg-[#C01D2E] rounded"
                >
                  <Text className="font-semibold text-base text-center text-white uppercase">
                    Lưu
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </GestureDetector>
  );
};

export default OrderItem;
