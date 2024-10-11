import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import moment from "moment-timezone";
import { OrderDish } from "@/app/types/order_type";
import { formatPriceVND } from "@/components/Format/formatPrice";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { calculateReservation } from "@/api/reservationApi";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { CalculateReservationResponse } from "@/app/types/reservation_type";

interface OrderInvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  customerName: string;
  customerPhone: string;
  mealTime: string;
  numOfPeople: number;
  tableName: string;
  orderId: string;
  orderDetails: OrderDish[];
}

const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  visible,
  onClose,
  customerName,
  customerPhone,
  mealTime,
  numOfPeople,
  tableName,
  orderId,
  orderDetails,
}) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();

  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );

  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [apiResponse, setApiResponse] =
    useState<CalculateReservationResponse | null>(null);

  // Define the request data
  const requestData = useMemo(
    () => ({
      reservationDate: reservationData?.result?.order?.reservationDate,
      numberOfPeople: reservationData?.result?.order?.numOfPeople ?? 0,
      endTime: new Date().toISOString(), // Replace with the appropriate time
      customerId: reservationData?.result?.order?.accountId,
      deposit: reservationData?.result?.order?.deposit,
      note: reservationData?.result?.order?.note,
      isPrivate: reservationData?.result?.order?.isPrivate,
      reservationDishDtos: orderDetails.map((item) => {
        const dishDto: any = {};
        if (item.dishSizeDetail) {
          dishDto.dishSizeDetailId = item.dishSizeDetail.dishSizeDetailId;
        }
        if (item.comboDish) {
          dishDto.combo = {
            comboId: item.comboDish.comboId,
            dishComboIds: item.comboDish.dishCombos.map(
              (dish) => dish.dishComboId
            ),
          };
        }
        return dishDto;
      }),
    }),
    [reservationData, orderDetails]
  );

  //   console.log("requestDataNha", JSON.stringify(requestData));

  useEffect(() => {
    if (visible && !hasFetched) {
      setLoading(true);
      calculateReservation(requestData)
        .then((response) => {
          setApiResponse(response);
          setHasFetched(true);
        })
        .catch((error) => {
          console.error("Failed to calculate reservation:", error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (!visible) {
      setHasFetched(false); // Reset when modal is closed
    }
  }, [visible, requestData]);

  const totalAmount = orderDetails.reduce(
    (total, item) =>
      total +
      (item.dishSizeDetail?.price || item.comboDish?.combo.price || 0) *
        item.quantity,
    0
  );
  const vat = totalAmount * 0.08;
  const grandTotal =
    totalAmount + vat - (reservationData?.result?.order?.deposit || 0);

  return (
    <Modal transparent={true} visible={visible} onDismiss={onClose}>
      <View className="flex-1 justify-center items-center bg-[#22222391] bg-opacity-50">
        <View className="bg-white w-[850px] h-[80%] rounded-lg py-6 px-10">
          <Text className="font-bold text-2xl text-center mt-4 mb-6 text-[#C01D2E] uppercase">
            Tổng hoá đơn đặt món tại bàn
          </Text>

          {/* Use FlatList for the entire modal content */}
          <FlatList
            data={orderDetails}
            keyExtractor={(item) => item.orderDetailsId}
            ListHeaderComponent={() => (
              <>
                {/* Customer Information Section */}
                <View className="flex-row items-start justify-between">
                  <View className="mb-4 w-[300px]">
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
                        {moment.utc(mealTime).format("HH:mm, DD/MM/YYYY") ||
                          "Không có thông tin"}
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
                  <View className="mb-4  w-[300px]">
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
                        {`#${orderId.slice(0, 8)}` || "Không có thông tin"}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className=" text-base font-semibold text-gray-500">
                        Trạng thái đơn:
                      </Text>
                      <Text className=" text-base font-semibold text-gray-800">
                        Đang dùng bữa
                      </Text>
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
                  <Text className="w-20 text-center font-semibold">
                    Đơn giá
                  </Text>
                  <Text className="w-10 text-center font-semibold">SL</Text>
                  <Text className="w-20 text-center font-semibold">
                    Thành tiền
                  </Text>
                  <Text className="w-52 text-center font-semibold">
                    Ghi chú
                  </Text>
                </View>
              </>
            )}
            renderItem={({ item, index }) => (
              <View className="flex-row items-center py-2 border-b border-gray-200">
                <Text className="w-10 text-center font-semibold">
                  {index + 1}
                </Text>
                <View className="flex-row items-center w-52 ml-4">
                  <Image
                    source={{
                      uri:
                        item.dishSizeDetail?.dish.image ||
                        item.comboDish?.combo.image,
                    }}
                    className="w-10 h-10 rounded mr-4"
                  />
                  <Text className="font-semibold">
                    {item.dishSizeDetail?.dish.name ||
                      item.comboDish?.combo.name}
                  </Text>
                </View>
                <Text className="w-16 ml-4 text-left">Vừa</Text>
                <Text className="w-20 text-center">
                  {formatPriceVND(
                    item.dishSizeDetail?.price ||
                      item.comboDish?.combo.price ||
                      0
                  )}
                </Text>
                <Text className="w-10 text-center">{item.quantity}</Text>
                <Text className="w-20 text-center font-semibold">
                  {formatPriceVND(
                    (item.dishSizeDetail?.price ||
                      item.comboDish?.combo.price ||
                      0) * item.quantity
                  )}
                </Text>
                <Text className="w-52 text-center">{item.note || ""}</Text>
              </View>
            )}
            ListFooterComponent={() => (
              <View className="flex flex-row justify-end my-4">
                <View className="w-[300px]">
                  <View className="flex-row justify-between">
                    <Text className="font-semibold text-gray-700">
                      Tổng thành tiền:
                    </Text>
                    <Text className="font-semibold">
                      {formatPriceVND(totalAmount)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="font-semibold text-gray-700">
                      VAT (8%):
                    </Text>
                    <Text className="font-semibold">{formatPriceVND(vat)}</Text>
                  </View>
                  {reservationData?.result?.order?.deposit && (
                    <View className="flex-row justify-between mt-2">
                      <Text className="font-semibold text-gray-700">
                        Đã trả trước:
                      </Text>
                      <Text className="font-semibold  text-gray-800">
                        -{" "}
                        {formatPriceVND(
                          reservationData?.result?.order?.deposit
                        )}
                      </Text>
                    </View>
                  )}
                  <View className="flex-row justify-between mt-2">
                    <Text className="font-semibold text-xl text-[#C01D2E]">
                      Tổng cộng:
                    </Text>
                    <Text className="font-semibold text-xl text-[#C01D2E]">
                      {formatPriceVND(grandTotal)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mt-2">
                    <Text className="font-semibold text-xl text-[#C01D2E]">
                      Tổng cộng API:
                    </Text>
                    <Text className="font-semibold text-xl text-[#C01D2E]">
                      {formatPriceVND(apiResponse?.result || 0)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Modal Close Button */}
          <View className="flex-row justify-around">
            <TouchableOpacity
              className="mt-4 bg-[#E3B054] p-2 rounded-lg w-1/3 self-center"
              onPress={onClose}
            >
              <Text className="text-white text-center font-semibold text-lg uppercase">
                Đặt món tiếp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-4 bg-[#C01D2E] p-2 rounded-lg w-1/3 self-center"
              // onPress={handlePayment}
            >
              <Text className="text-white text-center font-semibold text-lg uppercase">
                Thanh toán ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OrderInvoiceModal;
