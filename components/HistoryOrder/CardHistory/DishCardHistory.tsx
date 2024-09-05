import { formatPriceVND } from "@/components/Format/formatPrice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment-timezone";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";

interface DishCardHistoryProps {
  dish: any; // Adjust with the actual type of the dish
  itemWidth: number; // Add itemWidth prop
  showModal: (content: any) => void; // Function to show modal
}

const DishCardHistory: React.FC<DishCardHistoryProps> = ({
  dish,
  itemWidth,
  showModal,
}) => {
  console.log("====================================");
  console.log("itemWidth", itemWidth);
  console.log("====================================");
  return (
    <View className="flex-1 p-2 m-2 bg-white rounded-md relative shadow-lg">
      <Image
        source={{ uri: dish.dishSizeDetail.dish.image }}
        className="w-full h-40 rounded-md"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className="mt-2 text-lg font-bold">
          {dish.dishSizeDetail.dish.name}
        </Text>
        <Text className="text-gray-500">
          {dish.dishSizeDetail.dish.description}
        </Text>
        <Text className="text-gray-500">Số lượng: {dish.quantity}</Text>
        <Text className="text-gray-500">
          Thời gian đặt: {dish.timeArray.join("; ")}
        </Text>
      </View>

      <TouchableOpacity
        className="absolute top-3 right-3 rounded-full p-1"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
        onPress={() =>
          showModal(
            <View className="flex-row bg-white w-full rounded-lg">
              <Image
                source={{ uri: dish.dishSizeDetail.dish.image }}
                className="w-full h-40 rounded-md"
                style={{ height: 400, width: 600, resizeMode: "cover" }}
                resizeMode="cover"
              />
              <View className="ml-4 p-2">
                <Text className="font-bold text-[22px] ">
                  {dish.dishSizeDetail.dish.name}
                </Text>
                <Text className="text-gray-500 mb-2 text-base">
                  {dish.dishSizeDetail.dish.description}
                </Text>
                <Text className="font-bold text-lg text-[#C01D2E] mb-4">
                  {formatPriceVND(dish.dishSizeDetail.price)}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-700 font-semibold  text-base">
                    Số lượng:{" "}
                  </Text>
                  <Text className="text-[#EDAA16] font-semibold mr-4 text-lg">
                    {dish.quantity}
                  </Text>
                </View>

                <View className="flex-row  mb-4 items-center">
                  <Text className="text-gray-700 font-semibold  text-base">
                    Thời gian đặt:{" "}
                  </Text>
                  <Text className="text-[#EDAA16] font-semibold mr-4 text-lg">
                    {dish.timeArray.join("; ")}
                  </Text>
                </View>
                <View className="flex-row justify-end mt-6 items-center">
                  <Button
                    mode="contained"
                    className=" w-fit bg-[#C01D2E] rounded-md mr-4"
                    labelStyle={{ fontWeight: "600", fontSize: 16 }}
                  >
                    Đặt lại
                  </Button>
                </View>
              </View>
            </View>
          )
        }
      >
        <MaterialCommunityIcons
          name="arrow-top-right-thin-circle-outline"
          size={30}
          color="#FD495C"
        />
      </TouchableOpacity>
    </View>
  );
};

export default DishCardHistory;
