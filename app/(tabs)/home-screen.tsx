import SliderBanner from "@/components/SliderBanner";
import React from "react";
import { View, Text, Image } from "react-native";

const HomeScreen: React.FC = () => {
  return (
    <View className="bg-[#F9F9F9] flex-1">
      <View className="flex-row justify-center mx-auto w-fit ">
        <Text className="uppercase font-medium text-2xl text-center my-6 pb-4 border-b-2 text-[#333333] border-gray-400">
          CHÀO MỪNG BẠN ĐẾN VỚI NHÀ HÀNG THIÊN PHÚ!
        </Text>
      </View>
      <View className="flex-row justify-around">
        <View className="w-[50%] overflow-hidden">
          <SliderBanner />
        </View>
        <View className="w-[45%] shadow-xl rounded-xl">
          <Image
            source={require("@/assets/banner/Tutorial.png")} // Hình ảnh bạn muốn
            className="w-full h-[330px] rounded-xl shadow-xl"
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
