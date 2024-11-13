// /components/CustomDrawerContent.tsx
import React from "react";
import { View, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* Logo */}
      <View style={{ alignItems: "center", padding: 16 }}>
        <Image
          source={require("../assets/icon-nobg.jpg")} // Replace with your logo path
          style={{ width: 150, height: 150, marginBottom: 5 }}
        />
      </View>

      {/* Menu Items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
