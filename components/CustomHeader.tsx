// /components/CustomHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/routers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import moment from "moment-timezone";
import MarqueeText from "./MarqueeText";

interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const { deviceId, deviceCode, tableId, tableName } = useSelector(
    (state: RootState) => state.auth
  );
  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );

  // console.log("reservationData", reservationData);

  const customerName =
    reservationData?.result?.order?.account?.firstName || "Guest";

  const now = moment().tz("Asia/Ho_Chi_Minh").format("HH:mm,  DD/MM/YYYY ");

  return (
    <>
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
          <View className="flex-row justify-center items-center mr-2">
            <Text className="font-bold uppercase text-[18px] text-gray-600 mr-2">
              Xin chào,{" "}
              <Text className="font-bold uppercase text-[18px] text-gray-600 mr-2">
                {customerName}
              </Text>
            </Text>
            <MaterialCommunityIcons
              name="hand-peace"
              size={26}
              color="#EDAA16"
              style={{ marginRight: 10 }}
            />
          </View>
        </View>

        <View className="flex-row justify-end items-center mr-10">
          {/* <TouchableOpacity className="flex-row justify-center items-center mr-9 py-2 px-4  rounded-md shadow-lg">
          <FontAwesome name="phone" size={20} color="green" />
          <Text className="text-green-900 ml-3 font-semibold text-lg  ">
            Gọi Nhân Viên
          </Text>
        </TouchableOpacity> */}

          <View className="flex-row justify-center items-center mr-8">
            <FontAwesome name="calendar" size={20} color="gray" />
            <Text className="ml-2 font-semibold text-lg text-gray-700">
              {now}
            </Text>
          </View>

          <View
            style={{
              height: 40,
              borderRadius: 20,
              backgroundColor: "#EDAA16", // Placeholder for avatar
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}
              className="p-2"
            >
              {tableName}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default CustomHeader;
