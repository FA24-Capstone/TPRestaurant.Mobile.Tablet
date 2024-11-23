import MarqueeText from "@/components/MarqueeText";
import PromotionList from "@/components/PromotionList";
import SliderBanner from "@/components/SliderBanner";
import { RootState } from "@/redux/store";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { useSelector } from "react-redux";

type RootStackParamList = {
  transaction: { isSuccess: string };
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );
  const accountByPhone = useSelector((state: RootState) => state.account.data);

  const customerId =
    reservationData?.result?.order.accountId || accountByPhone?.id;
  return (
    <PaperProvider>
      <MarqueeText />
      <ScrollView className="bg-[#FFFFFF] flex-1">
        {/* <View className="flex-row justify-center mx-auto w-fit">
          <Text className="uppercase font-bold text-[28px] text-center my-8 pb-4 border-b-2 text-[#970C1A] border-[#970C1A]">
            CHÀO MỪNG BẠN ĐẾN VỚI NHÀ HÀNG THIÊN PHÚ!
          </Text>
        </View> */}

        <View className="flex-row justify-around">
          <View className="w-[50%] overflow-hidden">
            <SliderBanner />
          </View>
          <View className="w-[45%] shadow-xl rounded-xl">
            <Image
              source={require("../../assets/banner/Tutorial.jpeg")}
              className="w-full h-[330px] rounded-xl shadow-xl"
              resizeMode="cover"
            />
          </View>
        </View>
        {customerId && (
          <View className=" m-4">
            <Text className="font-semibold uppercase ml-4 text-xl">
              Ưu đãi từ nhà hàng thiên phú
            </Text>
            <PromotionList />
          </View>
        )}
      </ScrollView>
      {/* <View className="absolute bottom-0 left-0 right-0 flex-row justify-around bg-[#FFF] p-4">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("transaction", { isSuccess: "true" })
          }
          className="bg-green-500 w-[45%] py-4 rounded-lg"
        >
          <Text className="text-white text-center text-xl">
            Test Transaction True
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("transaction", { isSuccess: "false" })
          }
          className="bg-[#DC3545] w-[45%] py-4 rounded-lg"
        >
          <Text className="text-white text-center text-xl">
            Test Transaction False
          </Text>
        </TouchableOpacity>
      </View> */}
    </PaperProvider>
  );
};

export default HomeScreen;
