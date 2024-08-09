import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "react-native-elements";
import { Button } from "react-native-paper";

const OrderingDetail: React.FC = () => {
  return (
    <View className="flex-1 bg-white px-4 ">
      <View className="border-b border-gray-400 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold mb-1 text-gray-600">
            MÃ ĐƠN ĐẶT MÓN
          </Text>
          <Text className="font-bold text-lg  text-gray-600">#12564878</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center ">
            <MaterialCommunityIcons name="account" size={24} color="gray" />
            <Text className="text-gray-600 mr-3 text-base ml-2 font-semibold">
              GUEST:
            </Text>
            <Text className="text-[#EDAA16] text-xl font-semibold">2</Text>
          </View>
          <View className="flex-row items-center ">
            <MaterialCommunityIcons
              name="table-furniture"
              size={24}
              color="gray"
            />
            <Text className="text-gray-600 mr-3 text-base ml-2 font-semibold">
              TABLE:
            </Text>
            <Text className="text-[#EDAA16] text-xl font-semibold">001</Text>
          </View>
        </View>
      </View>
      <View className="flex-1 justify-center items-center">
        <Image
          source={require("../../assets/Icons/NoProduct.png")}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
        <Text className="text-gray-700 text-xl text-center my-6 w-[60%] uppercase">
          No products in this moment added
        </Text>
      </View>
    </View>
  );
};

export default OrderingDetail;
