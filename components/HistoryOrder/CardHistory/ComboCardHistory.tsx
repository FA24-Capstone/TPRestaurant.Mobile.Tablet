import { formatPriceVND } from "@/components/Format/formatPrice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment-timezone";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";

interface ComboCardHistoryProps {
  combo: any; // Dữ liệu từ API
  itemWidth: number;
  comboDetails: any;
  showModal: (content: any) => void; // Function để hiển thị modal
  noteOrder: string;
}

const ComboCardHistory: React.FC<ComboCardHistoryProps> = ({
  combo,
  itemWidth,
  comboDetails,
  showModal,
  noteOrder,
}) => {
  return (
    <View className="flex-1 p-2 m-2 bg-white rounded-md shadow-lg relative">
      <Image
        source={{ uri: combo.combo.image }} // Sử dụng đúng dữ liệu từ API
        className="w-full h-40 rounded-md"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className="mt-2 text-lg font-bold">{combo.combo.name}</Text>
        <Text className="text-gray-500">{combo.combo.description}</Text>
        <View className="flex-row justify-between my-2">
          <Text className="text-center text-base font-semibold text-[#C01D2E]">
            {formatPriceVND(combo.combo.price)}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-[#EDAA16] font-semibold mr-4 text-base">
              + {combo.quantity} combo
            </Text>
          </View>
        </View>
        <View className="mt-2 flex-row">
          <Text className="text-gray-700 font-semibold">Thời gian đặt:</Text>
          <View className="ml-4">
            <Text className="text-gray-500">
              • {moment.utc(combo.orderTime).format("HH:mm, DD/MM/YYYY")}
            </Text>
          </View>
        </View>
        {/* <View className="mt-2 flex-row">
          <Text className="text-gray-700 font-semibold">Ghi chú:</Text>
          <View className="ml-4">
            <Text className="text-gray-500">
              {noteOrder || "Không có ghi chú"}
            </Text>
          </View>
        </View> */}

        {comboDetails?.length > 0 && (
          <View className="p-2">
            <Text className="font-bold mb-2 text-gray-600">
              Lựa chọn món trong combo:
            </Text>
            <View className="flex-row">
              {comboDetails.map((detail: any) => (
                <View key={detail.comboOrderDetailId} className="mt-1 mr-2">
                  <Image
                    source={{
                      uri: detail.dishCombo.dishSizeDetail.dish.image,
                    }}
                    className="w-12 h-12 rounded-md"
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity
        className="absolute top-3 right-3 rounded-full p-1"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
        onPress={() => showModal(combo)}
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

export default ComboCardHistory;
