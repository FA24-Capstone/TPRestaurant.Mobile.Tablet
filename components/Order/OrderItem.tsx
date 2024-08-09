import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { addOrUpdateDish, removeDish } from "../../redux/slices/dishesSlice";

interface Dish {
  id: number;
  name: string;
  price: string;
  image: string | number;
  quantity: number;
  rating: number;
  ratingCount: number;
  type: string;
}

interface OrderItemProps {
  item: Dish;
}

const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
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

  const renderRightActions = () => (
    <TouchableOpacity
      onPress={() => dispatch(removeDish(item.id))}
      className="bg-[#C01D2E] justify-center items-center rounded-md px-6 h-full"
    >
      <Image
        source={require("../../assets/Icons/Trash.png")}
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
          <Image
            source={
              typeof item.image === "string" ? { uri: item.image } : item.image
            }
            className="h-20 w-20 rounded-md mr-4"
          />
          <View className="flex-row justify-between w-[70%]">
            <View className="h-[75%]">
              <Text className="flex-1 text-lg font-semibold mr-2.5">
                {item.name.length > 15
                  ? `${item.name.substring(0, 15)}...`
                  : item.name}
              </Text>
              <Text className="text-lg font-bold text-[#C01D2E]">
                {item.price}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-lg">Số lượng:</Text>
              <View className="flex-row items-center my-2 px-2 py-1 bg-white rounded-full">
                <TouchableOpacity
                  onPress={() => dispatch(removeDish(item.id))}
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
                  onPress={() =>
                    dispatch(
                      addOrUpdateDish({ ...item, quantity: item.quantity + 1 })
                    )
                  }
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

export default OrderItem;
