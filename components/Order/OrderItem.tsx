import React from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

  return (
    <GestureDetector gesture={gesture}>
      <View className="flex-row rounded-lg overflow-hidden items-center justify-between">
        <Animated.View
          className=" bg-[#EAF0F0] w-full my-2.5 rounded-lg shadow p-2.5"
          style={animatedStyle}
        >
          <View className="w-full flex-row">
            <Image
              source={
                typeof item.image === "string"
                  ? { uri: item.image }
                  : item.image
              }
              className="h-20 w-20 rounded-md mr-4"
            />
            <View className="flex-row justify-between w-[70%]">
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
              <View className="items-center">
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
                    onPress={() =>
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
          </View>
          <TextInput
            placeholder="Nhập ghi chú (tối đa 40 ký tự)"
            value={note} // Sử dụng note thay vì noteChild
            onChangeText={setNote} // Sử dụng setNote thay vì setNoteChild
            maxLength={40}
            className="border bg-white border-gray-300 p-2 rounded mt-4"
          />
        </Animated.View>
        <Animated.View className="ml-5 w-14 h-14" style={animatedStyle}>
          {renderRightActions()}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

export default OrderItem;
