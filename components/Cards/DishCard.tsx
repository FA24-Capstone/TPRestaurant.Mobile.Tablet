import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { addOrUpdateDish } from "../../redux/slices/dishesSlice";

interface DishCardProps {
  id: number; // Assume id is passed
  image: number | string; // Adjust type to handle local and URL images
  name: string;
  rating: number;
  ratingCount: number;
  type: string;
  price: string;
}

const DishCard: React.FC<DishCardProps> = ({
  id, // Assume id is passed as a prop
  image,
  name,
  rating,
  ratingCount,
  type,
  price,
}) => {
  const dispatch = useDispatch();

  const handleAddDish = () => {
    dispatch(
      addOrUpdateDish({
        id,
        image,
        name,
        rating,
        ratingCount,
        type,
        price,
        quantity: 1,
      })
    );
  };

  return (
    <View className="pt-24 m-2 overflow-hidden relative">
      <Image
        source={typeof image === "string" ? { uri: image } : image} // Handle both local and URL images
        className="absolute top-2 z-10 left-[20%] transform -translate-x-1/2 h-[130px] w-[130px] rounded-full border-2 p-2 border-black"
        resizeMode="cover"
      />
      <View className="pt-14 rounded-[16px] z-0 shadow-xl bg-[#FFF1E1]">
        <Text className="font-bold text-[20px] text-center">{name}</Text>
        <Text className="text-gray-500 text-center mb-2">{type}</Text>
        <View className="flex-row items-center mx-auto mb-2">
          <Icon name="star" size={20} color="#FFD700" />
          <Text className=" text-gray-500 ml-1 font-semibold">{rating}</Text>
          <Text className="text-gray-500 ml-1 font-semibold">
            ({ratingCount})
          </Text>
        </View>
        <Text className="font-bold text-lg text-center text-[#C01D2E]">
          {price}
        </Text>
        <TouchableOpacity
          className="border-[#E45834] border-2 p-2 rounded-[20px]  w-[70%] mx-auto mb-4 mt-2"
          onPress={handleAddDish}
        >
          <Text className="text-[#E45834] text-center font-bold text-lg">
            Chọn món này
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DishCard;
