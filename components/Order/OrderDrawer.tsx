import React, { useRef } from "react";
import { View, Text, Button, Dimensions } from "react-native";
import { DrawerLayoutAndroid } from "react-native";
import ListDish from "@/components/List/ListDish";
import { IconButton } from "react-native-paper";

const OrderDrawer: React.FC = () => {
  const drawerRef = useRef<DrawerLayoutAndroid>(null);
  const drawerWidth = Dimensions.get("window").width * 0.3; // 30% of screen width

  const navigationView = (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-4 text-lg font-bold">Order Details</Text>
      <IconButton
        icon="close"
        size={20}
        onPress={() => drawerRef.current?.closeDrawer()}
        className="absolute top-2 right-2"
      />
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={drawerWidth}
      drawerPosition="right"
      renderNavigationView={() => navigationView}
    >
      <View className="flex-1 items-center justify-center">
        <ListDish />
        <Button
          onPress={() => drawerRef.current?.openDrawer()}
          title="Open Order Panel"
          color="#6200ee"
        />
      </View>
    </DrawerLayoutAndroid>
  );
};

export default OrderDrawer;
