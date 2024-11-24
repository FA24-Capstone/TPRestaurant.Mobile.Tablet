import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native"; // Thêm Image ở đây
import { Button, Modal, Portal } from "react-native-paper";
import { ImageSourcePropType } from "react-native"; // Thêm để sử dụng ImageSourcePropType
import moment from "moment-timezone";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { ItemCouponPrograms } from "@/app/types/coupon_all_type";

interface PromotionModalProps {
  visible: boolean;
  promotion: ItemCouponPrograms | null;
  onDismiss: () => void;
  setVisible: (value: boolean) => void;
}

type RootStackParamList = {
  "list-dish": undefined; // Add this line
};

const PromotionModal: React.FC<PromotionModalProps> = ({
  visible,
  promotion,
  onDismiss,
  setVisible,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleOrder = () => {
    // Navigate to the "history-order" screen
    setVisible(false);
    navigation.navigate("list-dish");
  };
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{ flex: 1, marginBottom: 100 }}
      >
        <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
          {promotion && (
            <View className="w-[70%] bg-white p-10 rounded-lg">
              <View className="flex-row items-start">
                <View className="w-[45%] px-4 py-6">
                  <Image
                    source={{ uri: promotion.img }}
                    style={{
                      width: "100%",
                      height: 230,
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                    resizeMode="cover"
                  />
                </View>
                <View className="w-[55%]">
                  <Text className="font-bold mb-2 text-xl uppercase">
                    {promotion.title}
                  </Text>
                  <Text className="text-gray-600 mb-2 text-base">
                    Hết hạn:{" "}
                    {moment(promotion.expiryDate).format("HH:mm A, DD/MM/YYYY")}
                  </Text>

                  <Text className="mb-2 font-semibold text-xl text-[#970C1A]">
                    Giảm giá: {promotion.discountPercent}%
                  </Text>
                  <Text className="mb-3 font-semibold text-lg">
                    Tổng hoá đơn tối thiểu:{" "}
                    {promotion.minimumAmount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    })}
                  </Text>

                  <View className="flex-row  items-center">
                    <Text className="text-lg mr-2 text-gray-800">•</Text>
                    <Text className="text-gray-700">
                      Mã giảm giá chỉ dành cho khách hàng đủ điều kiện mới được
                      áp dụng.
                    </Text>
                  </View>
                  <View className="flex-row  items-center">
                    <Text className="text-lg mr-2 text-gray-800">•</Text>
                    <Text className="text-gray-700">
                      Có thể áp dụng chung với các mã khuyến mãi khác.
                    </Text>
                  </View>
                  <View className="flex-row  items-center">
                    <Text className="text-lg mr-2 text-gray-800">•</Text>
                    <Text className="text-gray-700">
                      Đặt món ngay và chọn ưu đãi để sử dụng mã giảm giá.
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row justify-around">
                <TouchableOpacity
                  className="bg-gray-700 w-56 px-3 py-2 rounded-md self-center"
                  onPress={onDismiss}
                >
                  <Text className="text-white text-base uppercase text-center font-bold">
                    Đóng
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-[#970C1A] px-3 w-56 py-2 rounded-md self-center"
                  onPress={handleOrder}
                >
                  <Text className="text-white text-center text-base uppercase font-bold">
                    Đặt món ngay
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

export default PromotionModal;
