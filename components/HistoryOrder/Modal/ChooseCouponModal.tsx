import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { getAvailableCoupons } from "@/api/couponApi";
import { ItemCoupons } from "@/app/types/coupon_type";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

interface ChooseCouponModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCoupon: (coupon: ItemCoupons) => void;
  totalAmount: number; // Pass the total amount to check conditions
}

const ChooseCouponModal: React.FC<ChooseCouponModalProps> = ({
  visible,
  onClose,
  onSelectCoupon,
  totalAmount,
}) => {
  const [coupons, setCoupons] = useState<ItemCoupons[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const response = await getAvailableCoupons(1, 10); // Fetch first page with 10 coupons
        if (response.isSuccess && response.result?.items) {
          setCoupons(response.result.items);
        } else {
          showErrorMessage(
            response.messages?.[0] || "Failed to fetch coupons."
          );
        }
      } catch (error) {
        showErrorMessage("An error occurred while fetching coupons.");
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchCoupons();
    }
  }, [visible]);

  const handleConfirmCoupon = () => {
    const selectedCoupon = coupons.find(
      (coupon) => coupon.couponProgramId === selectedCouponId
    );
    if (selectedCoupon) {
      onSelectCoupon(selectedCoupon);
      onClose();
    }
  };

  // Separate coupons into valid and invalid lists
  const validCoupons = coupons.filter(
    (coupon) => totalAmount >= coupon.minimumAmount
  );
  const invalidCoupons = coupons.filter(
    (coupon) => totalAmount < coupon.minimumAmount
  );

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-white bg-opacity-50">
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
                className="bg-[#EDAA16] p-2 rounded-lg w-1/3 self-center"
                onPress={handleConfirmCoupon}
                disabled={!selectedCouponId}
              >
                <Text className="text-white text-center font-semibold text-lg uppercase">
                  Chọn Coupon
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-xl font-semibold my-4 uppercase text-[#EDAA16] text-center">
              Chọn Coupon
            </Text>

            {/* Display Total Amount */}
            <View className="flex-row justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg">
              <Text className="text-lg font-bold text-gray-800">
                Tổng thành tiền:
              </Text>
              <Text className="text-lg font-bold text-[#EDAA16]">
                {totalAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                })}
              </Text>
            </View>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#EDAA16"
                className="mt-10"
              />
            ) : (
              <>
                {/* Valid Coupons */}
                {validCoupons.length > 0 && (
                  <>
                    <Text className="text-lg font-semibold mb-2 text-gray-800">
                      Coupon đủ điều kiện:
                    </Text>
                    {validCoupons.map((coupon) => (
                      <TouchableOpacity
                        key={coupon.couponProgramId}
                        className={`flex-row items-center justify-between p-4 mb-4 rounded-lg bg-gray-100 ${
                          selectedCouponId === coupon.couponProgramId
                            ? "border-2 border-[#EDAA16]"
                            : ""
                        }`}
                        onPress={() =>
                          setSelectedCouponId(coupon.couponProgramId)
                        }
                      >
                        <View className="flex-row items-center">
                          <Image
                            source={{ uri: coupon.img }}
                            className="w-32 h-20 rounded mr-4"
                          />
                          <View>
                            <Text className="font-bold text-lg">
                              {coupon.code}
                            </Text>
                            <Text className="text-gray-500">
                              Giảm {coupon.discountPercent}% - Đơn tối thiểu{" "}
                              {coupon.minimumAmount.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                                minimumFractionDigits: 0,
                              })}
                            </Text>
                            <Text className="text-gray-500">
                              HSD: {coupon.expiryDate.slice(0, 10)}
                            </Text>
                          </View>
                        </View>
                        <View className="mr-2">
                          <MaterialIcons
                            name={
                              selectedCouponId === coupon.couponProgramId
                                ? "radio-button-checked"
                                : "radio-button-unchecked"
                            }
                            size={24}
                            color={
                              selectedCouponId === coupon.couponProgramId
                                ? "#EDAA16"
                                : "gray"
                            }
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </>
                )}

                {/* Invalid Coupons */}
                {invalidCoupons.length > 0 && (
                  <>
                    <Text className="text-lg font-semibold mb-2 text-gray-800">
                      Coupon không đủ điều kiện:
                    </Text>
                    {invalidCoupons.map((coupon) => (
                      <TouchableOpacity
                        key={coupon.couponProgramId}
                        className="flex-row items-center justify-between p-4 mb-4 rounded-lg bg-gray-200"
                        disabled={true}
                      >
                        <View className="flex-row items-center opacity-50">
                          <Image
                            source={{ uri: coupon.img }}
                            className="w-32 h-20 rounded mr-4"
                          />
                          <View>
                            <Text className="font-bold text-lg">
                              {coupon.code}
                            </Text>
                            <Text className="text-gray-500">
                              Giảm {coupon.discountPercent}% - Đơn tối thiểu{" "}
                              {coupon.minimumAmount.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                                minimumFractionDigits: 0,
                              })}
                            </Text>
                            <Text className="text-gray-500">
                              HSD: {coupon.expiryDate.slice(0, 10)}
                            </Text>
                          </View>
                        </View>
                        <MaterialIcons
                          name="radio-button-unchecked"
                          size={24}
                          color="gray"
                        />
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ChooseCouponModal;
