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
        paddingTop: 40,
        paddingBottom: 20,
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        className="mx-4"
      >
        <MaterialCommunityIcons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <View className="flex-row items-center flex-1">
        <Text className="font-bold text-2xl text-gray-800 mr-6">{title}</Text>
        <View className="flex-row justify-center items-center mr-2">
          <Text className="font-semibold uppercase text-lg text-gray-600 mr-2">
            Xin chào, Phương
          </Text>
          <MaterialCommunityIcons
            name="hand-peace"
            size={20}
            color="black"
            style={{ marginRight: 10 }}
          />
        </View>

        <TextInput
          placeholder="Search"
          className="border-2 border-gray-300 rounded-md px-4 h-10 flex-1 mr-4"
          style={{ minWidth: 100 }} // Minimum width for search input
        />
      </View>

      <View className="flex-row justify-center items-center mr-10">
        <TouchableOpacity className="flex-row justify-center items-center mr-4 px-3 py-2 rounded-md shadow-lg">
          <FontAwesome name="phone" size={20} color="green" />
          <Text className="text-green-900 ml-3 text-semibold">
            Gọi Nhân Viên
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mr-4">
          <FontAwesome name="calendar" size={20} color="black" />
          <Text className="ml-2">October 18th 2002, 10:00AM</Text>
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