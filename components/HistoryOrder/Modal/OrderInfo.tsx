// OrderDetails.tsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import moment from "moment-timezone";
import { TouchableOpacity } from "react-native";
import { Coupon, ItemCoupons } from "@/app/types/coupon_type";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import ChooseCouponModal from "./ChooseCouponModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ReservationApiResponse } from "@/app/types/reservation_type";

interface OrderDetailsProps {
  customerName?: string;
  customerPhone?: string;
  mealTime?: string;
  numOfPeople?: number;
  tableName?: string;
  orderId?: string;
  setSelectedCoupon: (coupon: Coupon[]) => void;
  selectedCoupon?: Coupon[] | null;
  totalAmount: number;
  usePoints: boolean;
  setUsePoints: (value: boolean) => void;
  reservationData?: ReservationApiResponse | null;
  statusInfo: {
    color: string;
    text: string;
  };
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  customerName,
  customerPhone,
  mealTime,
  numOfPeople,
  tableName,
  orderId,
  reservationData,
  statusInfo,
  setSelectedCoupon,
  selectedCoupon,
  totalAmount,
  usePoints,
  setUsePoints,
}) => {
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const accountByPhone = useSelector((state: RootState) => state.account.data);
  // State to manage whether to use points for payment

  const handleTogglePoints = () => {
    setUsePoints(!usePoints); // Toggle the state
  };

  const handleSelectCoupon = (coupon: Coupon[]) => {
    setSelectedCoupon(coupon);
    setCouponModalVisible(false);
  };
  console.log("accountByPhone", JSON.stringify(accountByPhone, null, 2));

  const deposit = reservationData?.result?.order?.deposit || 0;
  const totalCouponDiscount =
    (totalAmount *
      (selectedCoupon?.reduce(
        (acc, coupon) => acc + (coupon.couponProgram.discountPercent || 0),
        0
      ) || 0)) /
    100;

  // Tính tổng hóa đơn cuối cùng sau giảm giá và cọc
  const grandTotal = totalAmount - deposit - totalCouponDiscount;

  // Tính số điểm tối đa áp dụng (10% của grandTotal)
  const maxPointsDiscount = Math.min(
    grandTotal * 0.1,
    accountByPhone?.loyalPoint ||
      reservationData?.result?.order?.account?.loyaltyPoint ||
      0
  );

  return (
    <>
      {/* Customer Information Section */}
      <View className="flex-row items-start justify-between">
        <View className="mb-4 w-[350px]">
          <Text className="font-semibold text-gray-800 text-lg mb-2">
            Thông tin khách hàng:
          </Text>
          <View className="flex-row justify-between">
            <Text className=" text-base font-semibold text-gray-500">
              Họ và tên:
            </Text>
            <Text className=" text-base font-semibold text-gray-800">
              {accountByPhone?.firstName
                ? ` ${accountByPhone.lastName} ${accountByPhone.firstName}`
                : customerName
                ? customerName
                : "Không có thông tin"}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className=" text-base font-semibold text-gray-500">
              Số điện thoại:
            </Text>
            <Text className=" text-base font-semibold text-gray-800">
              {`0${
                customerPhone
                  ? customerPhone
                  : accountByPhone?.phoneNumber
                  ? accountByPhone?.phoneNumber
                  : "Khong co"
              }` || "Không có thông tin"}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className=" text-base font-semibold text-gray-500">
              Thời gian dùng bữa:
            </Text>
            <Text className=" text-base font-semibold text-gray-800">
              {mealTime
                ? moment.utc(mealTime).format("HH:mm, DD/MM/YYYY")
                : "Không có thông tin"}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className=" text-base font-semibold text-gray-500">
              Số lượng khách:
            </Text>
            <Text className=" text-base font-semibold text-gray-800">
              {numOfPeople || "Không có thông tin"}
            </Text>
          </View>
          {(accountByPhone || reservationData) && (
            <View>
              <View className="flex-row justify-between">
                <Text className=" text-base font-semibold text-gray-500">
                  Dùng điểm:
                </Text>
                <TouchableOpacity onPress={handleTogglePoints}>
                  <FontAwesome
                    name={usePoints ? "toggle-on" : "toggle-off"}
                    size={30}
                    disabled={
                      accountByPhone?.loyalPoint === 0 ||
                      reservationData?.result?.order?.account?.loyaltyPoint ===
                        0
                    }
                    color={usePoints ? "#4CAF50" : "#757575"}
                  />
                </TouchableOpacity>
                <Text className=" text-base font-semibold text-gray-800">
                  {accountByPhone?.loyalPoint
                    ? accountByPhone?.loyalPoint
                    : reservationData?.result?.order?.account?.loyaltyPoint
                    ? reservationData?.result?.order?.account?.loyaltyPoint
                    : 0}{" "}
                  điểm
                </Text>
              </View>
              {usePoints && (
                <Text className="text-right text-base font-semibold text-red-500">
                  - {Math.floor(maxPointsDiscount)} điểm
                </Text>
              )}
            </View>
          )}
          {(accountByPhone || reservationData) && (
            <Text className="text-red-500 mt-2 font-semibold">
              Lưu ý: Dùng điểm được tối đa 10% trên tổng hoá đơn
            </Text>
          )}
        </View>

        {/* Order Information Section */}
        <View className="mb-4  w-[350px]">
          <Text className="font-semibold text-gray-800 text-lg mb-2">
            Thông tin đơn đặt món:
          </Text>

          <View className="flex-row justify-between">
            <Text className=" text-base font-semibold text-gray-500">
              Tên bàn:
            </Text>
            <Text className=" text-base font-semibold text-gray-800">
              {tableName || "Không có thông tin"}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className=" text-base font-semibold text-gray-500">
              Mã đơn:
            </Text>
            <Text className=" text-base font-semibold text-gray-800">
              {orderId ? `#${orderId.slice(0, 8)}` : "Không có thông tin"}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className=" text-base font-semibold text-gray-500">
              Loại đơn:
            </Text>
            <Text className=" text-base font-semibold text-gray-800">
              {reservationData?.result?.order?.orderType
                ? "Đặt trước"
                : "Ăn trực tiếp"}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-base font-semibold text-gray-500">
              Trạng thái đơn:
            </Text>
            <Text
              style={{ color: statusInfo.color }}
              className="text-base font-semibold"
            >
              {statusInfo.text}
            </Text>
          </View>
          {(accountByPhone || reservationData) && (
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-base font-semibold w-[40%] text-gray-500">
                Coupon áp dụng:
              </Text>
              {selectedCoupon ? (
                <View className="flex-row items-center gap-2  w-[60%]">
                  <Text className="text-base font-semibold w-[80%] text-gray-800">
                    {selectedCoupon
                      .map((coupon) => coupon.couponProgram.code)
                      .join(", ")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setCouponModalVisible(true)}
                    className=" w-[20%]"
                  >
                    <FontAwesome
                      name="pencil-square"
                      size={30}
                      color="#EDAA16"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setCouponModalVisible(true)}
                  className="py-2 px-3 rounded-lg bg-[#EDAA16]"
                >
                  <Text className="text-sm font-bold text-white uppercase">
                    Chọn Coupon
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
      <Text className="font-semibold text-gray-800 text-base mb-2">
        Danh sách món đã đặt:
      </Text>

      {/* Header Row */}
      <View className="flex-row items-center py-2 mt-2 bg-gray-100 rounded-md mb-2">
        <Text className="w-10 text-center font-semibold">STT</Text>
        <Text className="w-52 ml-4 font-semibold">Tên món ăn</Text>
        <Text className="w-16 ml-4 font-semibold">Size</Text>
        <Text className="w-20 text-center font-semibold">Đơn giá</Text>
        <Text className="w-10 text-center font-semibold">SL</Text>
        <Text className="w-20 text-center font-semibold">Thành tiền</Text>
        <Text className="w-52 text-center font-semibold">Ghi chú</Text>
      </View>

      <ChooseCouponModal
        visible={couponModalVisible}
        onClose={() => setCouponModalVisible(false)}
        onSelectCoupon={handleSelectCoupon}
        totalAmount={totalAmount}
      />
    </>
  );
};

export default OrderDetails;
