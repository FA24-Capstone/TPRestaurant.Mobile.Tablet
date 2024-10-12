import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onOpen: () => void;
  successMessage: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  onOpen,
  successMessage,
}) => {
  // Automatically close the modal after 1 minute
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose(); // Close the modal after 1 minute
      }, 50000); // 60000 milliseconds = 1 minute

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <Modal transparent={true} visible={visible}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-3/4 px-6 rounded-lg pb-6 pt-16 relative">
          {/* Centered Image Container */}
          <View className="absolute -top-20 left-0 right-0 items-center">
            <Image
              source={require("../../assets/Icons/iconAI.png")}
              className="w-40 h-40"
            />
          </View>
          <Text className="text-center text-lg font-semibold mb-4">
            {successMessage}
          </Text>
          <View className="flex-row justify-evenly mt-4">
            <TouchableOpacity
              className="bg-[#EDAA16] w-56 px-3 py-2 rounded-md self-center"
              onPress={() => {
                onOpen();
                onClose(); // Close the modal when this button is pressed
              }}
            >
              <Text className="text-white text-base uppercase text-center font-bold">
                Xem lại hoá đơn
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-green-500 px-3 w-56 py-2 rounded-md self-center"
              onPress={onClose} // Close the modal when this button is pressed
            >
              <Text className="text-white text-center text-base uppercase font-bold">
                Đóng và thoát ra
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
