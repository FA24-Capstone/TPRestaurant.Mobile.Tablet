import { formatPriceVND } from "@/components/Format/formatPrice";
import StatusLabel from "@/components/StatusLabel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment-timezone";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Button, Checkbox } from "react-native-paper";
import RenderHTML from "react-native-render-html";

interface ComboCardHistoryProps {
  combo: any; // Dữ liệu từ API
  itemWidth: number;
  comboDetails: any;
  showModal: (content: any) => void; // Function để hiển thị modal
  noteOrder: string;
  isSelected: boolean; // Prop mới để xác định trạng thái đã chọn
  toggleSelect: (id: string) => void; // Prop mới để xử lý chọn/bỏ chọn
}

const ComboCardHistory: React.FC<ComboCardHistoryProps> = ({
  combo,
  itemWidth,
  comboDetails,
  showModal,
  noteOrder,
  isSelected,
  toggleSelect,
}) => {
  // console.log("comboNha", combo);

  // Hàm để giới hạn số ký tự
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <TouchableOpacity
      onPress={() => showModal(combo)}
      className="flex-1 p-2 m-2 bg-white rounded-md shadow-lg relative"
    >
      <Image
        source={{ uri: combo.image }} // Sử dụng đúng dữ liệu từ API
        className="w-full h-40 rounded-md"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className="mt-2 text-lg font-bold">{combo.comboName}</Text>
        {combo.statusId === 2 && (
          <View style={{ position: "absolute", top: 5, right: 5 }}>
            <Checkbox
              status={isSelected ? "checked" : "unchecked"}
              onPress={() => toggleSelect(combo.orderDetailsId)}
            />
          </View>
        )}
        <View className="max-w-[600px]  -my-2">
          <RenderHTML
            contentWidth={100}
            source={{
              html: truncateText(combo.description || "chưa có mô tả", 60),
            }} // Giới hạn số ký tự ở đây
            tagsStyles={{
              p: { fontSize: 14, color: "gray" },
            }}
          />
        </View>
        <View className="flex-row justify-between flex-wrap my-2">
          <Text className="text-center text-base font-semibold text-[#C01D2E]">
            {formatPriceVND(combo.price)}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-[#EDAA16] font-semibold mr-4 text-base">
              + {combo.quantity} combo
            </Text>
          </View>
        </View>
        <View className="mt-2 flex-row flex-wrap">
          <Text className="text-gray-700 font-semibold">Thời gian đặt:</Text>
          <View className="ml-4">
            <Text className="text-gray-500">
              • {moment.utc(combo.startDate).format("HH:mm, DD/MM/YYYY")}
            </Text>
          </View>
        </View>
        <View className="mt-2 flex-row">
          <Text className="text-gray-700 font-semibold">Ghi chú:</Text>
          <View className="ml-4">
            <Text className="text-gray-500">
              {combo.note || "Không có ghi chú"}
            </Text>
          </View>
        </View>

        {combo.comboDishes.length > 0 && (
          <View className="p-2">
            <Text className="font-bold mb-2 text-gray-600">
              Lựa chọn món trong combo:
            </Text>
            <View className="flex-row flex-wrap">
              {combo.comboDishes.map((detail: any) => (
                <View key={detail.dishId} className="mt-1 mr-2">
                  <Image
                    source={{
                      uri: detail.image,
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
      <View className="absolute top-3 left-3">
        <StatusLabel statusId={combo.statusId} />
      </View>
    </TouchableOpacity>
  );
};

export default ComboCardHistory;
