import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import Menu from "@/components/List/Menu";
import { IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import OrderingDetail from "./OrderingDetail";

const OrderPanel: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const fullScreenWidth = Dimensions.get("window").width;
  const drawerWidth = isPanelOpen ? fullScreenWidth * 0.35 : 0; // Chiếm 30% chiều rộng màn hình
  const listWidth = isPanelOpen ? fullScreenWidth * 0.65 : fullScreenWidth; // Chiều rộng còn lại hoặc toàn bộ

  const OrderDetails = () => (
    <View className={`flex-1 bg-white p-2`} style={{ width: drawerWidth }}>
      <IconButton
        icon={() => (
          <MaterialCommunityIcons name="arrow-right" size={25} color="gray" />
        )}
        onPress={() => setIsPanelOpen(false)}
        size={20}
      />
      <OrderingDetail />
    </View>
  );

  console.log("isPanelOpen", isPanelOpen);

  return (
    <View className="flex-row flex-1 relative">
      <View style={{ width: listWidth }}>
        <Menu isPanelOpen={isPanelOpen} />
      </View>
      {!isPanelOpen && (
        <View className="absolute right-2 top-1/2 transform -translate-y-1/2  rounded-md bg-gray-300">
          <IconButton
            icon="drag-vertical" // Sử dụng biểu tượng hai sọc dọc
            onPress={() => setIsPanelOpen(true)}
            size={30}
          />
        </View>
      )}
      {isPanelOpen && <OrderDetails />}
    </View>
  );
};

export default OrderPanel;
