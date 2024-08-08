// /components/CustomHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/routers";

interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: "space-between",
        shadowColor: "#000", // Màu của shadow
        shadowOffset: { width: 0, height: 2 }, // Offset của shadow
        shadowOpacity: 0.25, // Độ mờ của shadow
        shadowRadius: 3.84, // Bán kính của shadow
        elevation: 5, // Độ cao của shadow (Android)
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        className="mx-4 p-3 rounded-lg bg-[#ffffff] shadow-lg"
      >
        <MaterialCommunityIcons name="menu" size={30} color="black" />
      </TouchableOpacity>

      <View className="flex-row items-center flex-1">
        {/* <Text className="font-bold text-2xl text-gray-800 mr-6">{title}</Text> */}
        <View className="flex-row justify-center items-center mr-2">
          <Text className="font-bold uppercase text-[18px] text-gray-600 mr-2">
            Xin chào, Phương
          </Text>
          <MaterialCommunityIcons
            name="hand-peace"
            size={26}
            color="#EDAA16"
            style={{ marginRight: 10 }}
          />
        </View>

        {/* <TextInput
          placeholder="Search"
          className="border-2 border-gray-300 rounded-md px-4 h-10 flex-1 mr-4"
          style={{ minWidth: 100 }} // Minimum width for search input
        /> */}
      </View>

      <View className="flex-row justify-end items-center mr-10">
        <TouchableOpacity className="flex-row justify-center items-center mr-9 py-2 px-4  rounded-md shadow-lg">
          <FontAwesome name="phone" size={20} color="green" />
          <Text className="text-green-900 ml-3 font-semibold text-lg  ">
            Gọi Nhân Viên
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mr-8">
          <FontAwesome name="calendar" size={20} color="gray" />
          <Text className="ml-2 font-semibold text-lg text-gray-700">
            October 18th 2002, 10:00AM
          </Text>
        </View>

        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#ccc", // Placeholder for avatar
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: "#fff" }}>A</Text>
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;
