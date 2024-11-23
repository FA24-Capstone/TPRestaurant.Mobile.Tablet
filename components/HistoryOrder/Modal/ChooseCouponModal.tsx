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
// import { getAvailableCoupons } from "@/api/couponApi";
import { Coupon, ItemCoupons } from "@/app/types/coupon_type";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getAvailableCouponsByAccountId } from "@/api/couponApi";

interface ChooseCouponModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCoupon: (coupon: Coupon[]) => void;
  totalAmount: number; // Pass the total amount to check conditions
}

const ChooseCouponModal: React.FC<ChooseCouponModalProps> = ({
  visible,
  onClose,
  onSelectCoupon,
  totalAmount,
}) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]); // State cho danh sách coupon
  const [loading, setLoading] = useState(false);
  const [selectedCouponIds, setSelectedCouponIds] = useState<string[]>([]);

  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );
  const accountByPhone = useSelector((state: RootState) => state.account.data);

  const customerId =
    reservationData?.result?.order.accountId || accountByPhone?.id;

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      const pageNumber = 1;
      const pageSize = 10;
      if (customerId) {
        try {
          const response = await getAvailableCouponsByAccountId(
            customerId,
            pageNumber,
            pageSize,
            totalAmount
          );
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
      }
    };

    if (visible) {
      fetchCoupons();
    }
  }, [visible]);

  const handleConfirmCoupon = () => {
    const selectedCoupons = coupons.filter((coupon) =>
      selectedCouponIds.includes(coupon.couponId)
    );
    if (selectedCoupons.length > 0) {
      onSelectCoupon(selectedCoupons);
      onClose();
    }
  };

  const toggleCouponSelection = (couponId: string) => {
    setSelectedCouponIds((prevSelectedCouponIds) =>
      prevSelectedCouponIds.includes(couponId)
        ? prevSelectedCouponIds.filter((id) => id !== couponId)
        : [...prevSelectedCouponIds, couponId]
    );
  };

  // Separate coupons into valid and invalid lists
  const validCoupons = coupons.filter(
    (coupon) => totalAmount >= coupon.couponProgram.minimumAmount
  );
  const invalidCoupons = coupons.filter(
    (coupon) => totalAmount < coupon.couponProgram.minimumAmount
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
                disabled={selectedCouponIds.length === 0}
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
                        key={coupon.couponId}
                        className={`flex-row items-center justify-between p-4 mb-4 rounded-lg bg-gray-100 ${
                          selectedCouponIds.includes(coupon.couponId)
                            ? "border-2 border-[#EDAA16]"
                            : ""
                        }`}
                        onPress={() => toggleCouponSelection(coupon.couponId)}
                      >
                        <View className="flex-row items-center">
                          <Image
                            source={{ uri: coupon.couponProgram.img }}
                            className="w-32 h-20 rounded mr-4"
                          />
                          <View>
                            <Text className="font-bold text-lg">
                              {coupon.couponProgram.code}
                            </Text>
                            <Text className="text-gray-500">
                              Giảm {coupon.couponProgram.discountPercent}% - Đơn
                              tối thiểu{" "}
                              {coupon.couponProgram.minimumAmount.toLocaleString(
                                "vi-VN",
                                {
                                  style: "currency",
                                  currency: "VND",
                                  minimumFractionDigits: 0,
                                }
                              )}
                            </Text>
                            <Text className="text-gray-500">
                              HSD:{" "}
                              {coupon.couponProgram.expiryDate.slice(0, 10)}
                            </Text>
                          </View>
                        </View>
                        <View className="mr-2">
                          <MaterialIcons
                            name={
                              selectedCouponIds.includes(coupon.couponId)
                                ? "radio-button-checked"
                                : "radio-button-unchecked"
                            }
                            size={24}
                            color={
                              selectedCouponIds.includes(coupon.couponId)
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
                        key={coupon.couponId}
                        className="flex-row items-center justify-between p-4 mb-4 rounded-lg bg-gray-200"
                        disabled={true}
                      >
                        <View className="flex-row items-center opacity-50">
                          <Image
                            source={{ uri: coupon.couponProgram.img }}
                            className="w-32 h-20 rounded mr-4"
                          />
                          <View>
                            <Text className="font-bold text-lg">
                              {coupon.couponProgram.code}
                            </Text>
                            <Text className="text-gray-500">
                              Giảm {coupon.couponProgram.discountPercent}% - Đơn
                              tối thiểu{" "}
                              {coupon.couponProgram.minimumAmount.toLocaleString(
                                "vi-VN",
                                {
                                  style: "currency",
                                  currency: "VND",
                                  minimumFractionDigits: 0,
                                }
                              )}
                            </Text>
                            <Text className="text-gray-500">
                              HSD:{" "}
                              {coupon.couponProgram.expiryDate.slice(0, 10)}
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
