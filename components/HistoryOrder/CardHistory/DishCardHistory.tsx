import { formatPriceVND } from "@/components/Format/formatPrice";
import StatusLabel from "@/components/StatusLabel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment-timezone";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";

interface DishCardHistoryProps {
  dish: any; // Dữ liệu từ API
  itemWidth: number;
  showModal: (content: any) => void; // Function để hiển thị modal
  noteOrder: string;
}

const DishCardHistory: React.FC<DishCardHistoryProps> = ({
  dish,
  itemWidth,
  showModal,
  noteOrder,
}) => {
  // console.log("DishCardHistory", dish);

  return (
    <TouchableOpacity
      onPress={() => showModal(dish)}
      className="flex-1 p-2 m-2 bg-white rounded-md relative shadow-lg"
    >
      <Image
        source={{ uri: dish.image }} // Sử dụng đúng dữ liệu từ API
        className="w-full h-40 rounded-md"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className="mt-2 text-lg font-bold">{dish.name}</Text>
        <Text
          className="text-gray-500"
          numberOfLines={1} // Số dòng tối đa
          ellipsizeMode="tail"
        >
          {dish.description ?? "chưa có mô tả"}
        </Text>
        <View className="flex-row justify-between my-2 flex-wrap">
          <Text className="text-center text-base font-bold text-gray-500">
            {dish.sizeName === "LARGE"
              ? "LỚN"
              : dish.sizeName === "MEDIUM"
              ? "VỪA"
              : dish.sizeName === "SMALL"
              ? "NHỎ"
              : "Size không xác định"}
          </Text>
          <Text className="text-center text-base font-semibold text-[#C01D2E]">
            {formatPriceVND(dish.price)}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-[#EDAA16] font-semibold mr-4 text-base">
              + {dish.quantity} món
            </Text>
          </View>
        </View>
        <View className="mt-2 flex-row flex-wrap">
          <Text className="text-gray-700 font-semibold">Thời gian đặt:</Text>
          <View className="ml-4">
            <Text className="text-gray-500">
              • {moment.utc(dish.startDate).format("HH:mm, DD/MM/YYYY")}
            </Text>
          </View>
        </View>
        <View className="mt-2 flex-row">
          <Text className="text-gray-700 font-semibold">Ghi chú:</Text>
          <View className="ml-4">
            <Text className="text-gray-500">
              {dish.note || "Không có ghi chú"}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="absolute top-3 right-3 rounded-full p-1"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
        onPress={() => showModal(dish)}
      >
        <MaterialCommunityIcons
          name="arrow-top-right-thin-circle-outline"
          size={30}
          color="#FD495C"
        />
      </TouchableOpacity>
      <View className="absolute top-3 left-3">
        <StatusLabel statusId={dish.statusId} />
      </View>
    </TouchableOpacity>
  );
};

export default DishCardHistory;
