import React from "react";
import { View, Text, Image } from "react-native"; // Thêm Image ở đây
import { Button, Modal, Portal } from "react-native-paper";
import { ImageSourcePropType } from "react-native"; // Thêm để sử dụng ImageSourcePropType

interface Promotion {
  title: string;
  expiryDate: string;
  description: string;
  image: ImageSourcePropType; // Thêm thuộc tính này
}

interface PromotionModalProps {
  visible: boolean;
  promotion: Promotion | null;
  onDismiss: () => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({
  visible,
  promotion,
  onDismiss,
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{ flex: 1 }}
      >
        <View className="flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]">
          {promotion && (
            <View className="w-[90%] bg-white p-5 rounded-lg">
              {/* Hiển thị hình ảnh ở đây */}
              <Image
                source={promotion.image}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 8,
                  marginBottom: 10,
                }} // Điều chỉnh kích thước theo ý muốn
                resizeMode="cover"
              />
              <Text className="text-lg font-bold mb-2">{promotion.title}</Text>
              <Text className="text-gray-500 mb-2">
                Hết hạn: {promotion.expiryDate}
              </Text>
              <Text className="mb-5">{promotion.description}</Text>
              <Button
                mode="contained"
                className="bg-[#970C1A]"
                onPress={onDismiss}
              >
                Đóng
              </Button>
            </View>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

export default PromotionModal;
