// import { ComboOrder } from "@/app/types/order_type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
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
}
const ComboOrderItem: React.FC<ComboOrderItemProps> = ({ item }) => {
  const dispatch = useDispatch();
  const translateX = useSharedValue(0);

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

  return (
    <GestureDetector gesture={gesture}>
      <View className="flex-row rounded-lg overflow-hidden items-center justify-between">
        <Animated.View
          className="flex-row bg-[#EAF0F0] w-full my-2.5 rounded-lg shadow p-2.5"
          style={animatedStyle}
        >
          <View className="flex-row">
            <Image
              source={
                typeof item.comboImage === "string"
                  ? { uri: item.comboImage }
                  : item.comboImage
              }
              className="h-20 w-20 rounded-md"
            />
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
        </Animated.View>
        <Animated.View className="ml-5 w-14 h-14" style={animatedStyle}>
          {renderRightActions()}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

export default ComboOrderItem;
