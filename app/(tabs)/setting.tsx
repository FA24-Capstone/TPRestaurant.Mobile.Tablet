import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice"; // Adjust the import path to your authSlice file

const SettingScreen: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
  };

  return (
    <View className="flex-1 justify-center items-center bg-[#F9F9F9]">
      <Text className="text-2xl font-bold mb-5">Settings</Text>
      <TouchableOpacity
        className="bg-[#970C1A] py-3 px-6 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg font-bold text-center">
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingScreen;
