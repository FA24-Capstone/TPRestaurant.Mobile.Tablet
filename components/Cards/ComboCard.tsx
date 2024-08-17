import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Combo } from "@/app/types/combo_type";

interface ComboCardProps {
  combo: Combo;
  onSelect: (id: string) => void;
}

const ComboCard: React.FC<ComboCardProps> = ({ combo, onSelect }) => {
  return (
    <TouchableOpacity onPress={() => onSelect(combo.comboId)}>
      <View className="pt-24 m-2 overflow-hidden relative">
        <Image
          source={
            typeof combo.image === "string" ? { uri: combo.image } : combo.image
          }
          className="absolute top-2 z-10 left-[20%] transform -translate-x-1/2 h-[130px] w-[130px] rounded-full border-2 p-2 border-black"
          resizeMode="cover"
        />
        <View className="pt-14 rounded-[16px] z-0 shadow-xl bg-[#FFF1E1]">
          <Text className="font-bold text-[20px] text-center">
            {combo.name}
          </Text>
          <Text className="text-gray-500 text-center mb-2">
            {combo.category.name}
          </Text>
          <Text className="font-bold text-lg text-center text-[#C01D2E]">
            {combo.price} VND
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ComboCard;
