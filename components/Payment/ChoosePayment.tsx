import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import walletImage from "../../assets/Icons/wallet.jpg";

interface ChoosePaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmPayment: (method: number) => void;
}

const ChoosePaymentModal: React.FC<ChoosePaymentModalProps> = ({
  visible,
  onClose,
  onConfirmPayment,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    number | null
  >(null);

  // Enum for payment methods
  const paymentMethods = [
    {
      id: 1,
      name: "TIỀN MẶT",
      description: "Thanh toán trực tiếp",
      image: require("../../assets/Icons/wallet.jpg"),
    },
    {
      id: 2,
      name: "VNPAY",
      description: "Tài khoản ví VNPAY",
      image: require("../../assets/Icons/vnpay.jpg"),
    },
    {
      id: 3,
      name: "MOMO",
      description: "Tài khoản ví MOMO",
      image: require("../../assets/Icons/momo.jpg"),
    },
  ];

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-white">
        <View className="bg-white w-[850px] h-[90%] rounded-lg py-6 px-10">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-row justify-between mb-6 mt-4">
              <TouchableOpacity
                onPress={onClose}
                className="py-2 px-3 flex-row gap-2"
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={30}
                  color="black"
                />
                <Text className="text-lg font-bold text-gray-600 uppercase">
                  Quay lại
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className=" bg-[#C01D2E] p-2 rounded-lg w-1/3 self-center"
                onPress={() =>
                  selectedPaymentMethod &&
                  onConfirmPayment(selectedPaymentMethod)
                }
              >
                <Text className="text-white text-center font-semibold text-lg uppercase">
                  Chọn thanh toán
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-xl font-semibold my-8 uppercase text-[#C01D2E] text-center">
              Chọn Phương Thức Thanh Toán
            </Text>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                className={`flex-row items-center justify-between p-4 mb-4 rounded-lg bg-gray-100 ${
                  selectedPaymentMethod === method.id
                    ? "border-2 border-black"
                    : ""
                }`}
                onPress={() => setSelectedPaymentMethod(method.id)}
              >
                <View className="flex-row items-center">
                  <Image
                    source={method.image}
                    className="w-12 h-12 rounded mr-4"
                  />
                  <View>
                    <Text className="font-bold text-lg">{method.name}</Text>
                    <Text className="text-gray-500">{method.description}</Text>
                  </View>
                </View>
                <View className="mr-2">
                  <MaterialIcons
                    name={
                      selectedPaymentMethod === method.id
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color={
                      selectedPaymentMethod === method.id ? "black" : "gray"
                    }
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ChoosePaymentModal;
