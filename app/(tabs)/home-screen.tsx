import PromotionList from "@/components/PromotionList";
import SliderBanner from "@/components/SliderBanner";
import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

const HomeScreen: React.FC = () => {
  return (
    <PaperProvider>
      <ScrollView className="bg-[#FFFFFF] flex-1">
        <View className="flex-row justify-center mx-auto w-fit">
          <Text className="uppercase font-bold text-[28px] text-center my-8 pb-4 border-b-2 text-[#970C1A] border-[#970C1A]">
            CHÀO MỪNG BẠN ĐẾN VỚI NHÀ HÀNG THIÊN PHÚ!
          </Text>
        </View>

        <View className="flex-row justify-around">
          <View className="w-[50%] overflow-hidden">
            <SliderBanner />
          </View>
          <View className="w-[45%] shadow-xl rounded-xl">
            <Image
              source={require("@/assets/banner/Tutorial.png")}
              className="w-full h-[330px] rounded-xl shadow-xl"
              resizeMode="cover"
            />
          </View>
        </View>
        <View className=" m-4">
          <Text className="font-semibold ml-4 text-xl">Khuyến mãi hot</Text>
          <PromotionList />
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

export default HomeScreen;
