// OrderDetails.tsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import moment from "moment-timezone";
import { TouchableOpacity } from "react-native";
import { ItemCoupons } from "@/app/types/coupon_type";
import ChooseCouponModal from "./ChooseCouponModal";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

interface OrderDetailsProps {
  customerName?: string;
  customerPhone?: string;
  mealTime?: string;
  numOfPeople?: number;
  tableName?: string;
  orderId?: string;
  setSelectedCoupon: (coupon: ItemCoupons) => void;
  selectedCoupon?: ItemCoupons;
  totalAmount: number;
  reservationData?: {
    result?: {
      order?: {
        orderType?: boolean;
      };
    };
  };
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
}) => {
  const [couponModalVisible, setCouponModalVisible] = useState(false);

  const handleSelectCoupon = (coupon: ItemCoupons) => {
    setSelectedCoupon(coupon);
    setCouponModalVisible(false);
  };

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
              {customerName || "Không có thông tin"}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className=" text-base font-semibold text-gray-500">
              Số điện thoại:
            </Text>
            <Text className=" text-base font-semibold text-gray-800">
              {`0${customerPhone}` || "Không có thông tin"}
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
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-base font-semibold text-gray-500">
              Coupon áp dụng:
            </Text>
            {selectedCoupon ? (
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-semibold text-gray-800">
                  {selectedCoupon.code}
                </Text>
                <TouchableOpacity
                  onPress={() => setCouponModalVisible(true)}
                  // className="py-2 px-3 rounded-lg bg-[#EDAA16]"
                >
                  <FontAwesome name="pencil-square" size={30} color="#EDAA16" />
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
