// import { ComboOrder } from "@/app/types/order_type";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { formatPriceVND } from "../Format/formatPrice";
import {
  decreaseComboQuantity,
  increaseComboQuantity,
  removeCombo,
} from "@/redux/slices/dishesSlice";

interface ComboDish {
  id: string;
  name: string;
  price: number;
}

export interface ComboOrder {
  type?: "combo";
  comboId: string;
  comboName: string;
  quantity: number;
  comboImage: string | number;
  comboPrice: number;
  selectedDishes: ComboDish[];
  note?: string;
}

interface ComboOrderItemProps {
  item: ComboOrder;
  note: string; // Thay noteChild bằng note
  setNote: (note: string) => void; // Thay setNoteChild bằng setNote
}
const ComboOrderItem: React.FC<ComboOrderItemProps> = ({
  item,
  note,
  setNote,
}) => {
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

  const handleRemoveCombo = (comboId: string) => {
    dispatch(removeCombo(comboId));
  };

  // New handlers for quantity adjustment
  const handleIncreaseQuantity = () => {
    dispatch(increaseComboQuantity(item.comboId));
  };

  const handleDecreaseQuantity = () => {
    dispatch(decreaseComboQuantity(item.comboId));
  };

  const renderRightActions = () => (
    <TouchableOpacity
      onPress={() => handleRemoveCombo(item.comboId)}
      className="bg-[#C01D2E] justify-center items-center rounded-md px-6 h-full"
    >
      <Image
        source={require("../../assets/Icons/Trash.jpeg")}
        className="w-6 h-6"
      />
    </TouchableOpacity>
  );

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
          <View className="flex-row w-full">
            <View className=" w-[18%]">
              <Image
                source={
                  typeof item.comboImage === "string"
                    ? { uri: item.comboImage }
                    : item.comboImage
                }
                className="h-20 w-20 rounded-md mr-4"
              />
            </View>
            <View className="ml-5 flex-1">
              <Text className="text-lg font-bold">{item.comboName}</Text>
              <Text className="text-lg font-bold text-[#C01D2E]">
                {formatPriceVND(item.comboPrice)}
              </Text>
              {item.selectedDishes.length > 0 && (
                <View>
                  <Text className="mt-1">Selected Dishes:</Text>
                  {item.selectedDishes.map((dish) => (
                    <Text key={dish.id} className="text-sm text-gray-700">
                      - {dish.name} ({formatPriceVND(dish.price)})
                    </Text>
                  ))}
                </View>
              )}
            </View>
            <View className="flex-row ">
              <View className="items-center">
                <Text className="text-base">Số lượng:</Text>
                <View className="flex-row items-center my-2 px-2 py-1 bg-white rounded-full">
                  <TouchableOpacity
                    onPress={handleDecreaseQuantity}
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
                    onPress={handleIncreaseQuantity}
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
            </View>
            <TouchableOpacity onPress={openModal} className="mt-5 ml-2">
              <FontAwesome name="pencil-square" size={30} color="#EDAA16" />
            </TouchableOpacity>
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

export default ComboOrderItem;
