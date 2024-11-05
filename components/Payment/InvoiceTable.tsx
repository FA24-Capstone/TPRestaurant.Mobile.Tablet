import React from "react";
import { ScrollView, View, Text, Image } from "react-native";
import { PaymentDetailReponse } from "@/app/types/payment_type";
import moment from "moment-timezone";

interface InvoiceTableProps {
  paymentDetails: PaymentDetailReponse | null;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ paymentDetails }) => {
  if (!paymentDetails) {
    return (
      <Text className="italic text-red-600">No invoice details available.</Text>
    );
  }

  const transaction = paymentDetails.result.transaction;
  const order = paymentDetails.result.order.order;
  const orderDishes = paymentDetails.result.order.orderDishes;

  return (
    <ScrollView className="flex-1 w-[70%] bg-gray-100 p-4 rounded-lg">
      {/* Header */}
      <View className="flex flex-row justify-between items-center bg-[#C01D2E] p-4 rounded-t-lg">
        <Image
          source={require("../../assets/icon.jpg")}
          className="w-20 h-20 rounded-full"
        />
        <View className="text-right">
          <Text className="text-white  text-right text-xl mb-2 font-bold">
            Nhà hàng Thiên Phú
          </Text>
          <Text className="font-bold text-sm text-white  text-right">
            0919.782.444
          </Text>
          <Text className="font-bold text-sm text-white  text-right">
            78 Đường Lý Tự Trọng, Phường 2, Đà Lạt, Việt Nam
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between">
        {/* Order Information */}
        <View className="bg-white w-[48%] p-4 mt-4 rounded-lg">
          <Text className="text-lg uppercase font-bold border-b-2 border-[#C01D2E] mb-2">
            Thông tin đơn hàng
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="font-semibold text-gray-600 text-base">
                Mã đơn:{" "}
              </Text>
              <Text className="font-semibold uppercase max-w-[70%] text-gray-800 text-right text-base">
                {" "}
                #{order.orderId.slice(0, 8)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="font-semibold text-gray-600 text-base">
                Ngày đặt/dùng bữa:{" "}
              </Text>
              <Text className="font-semibold  max-w-[70%] text-gray-800 text-right text-base">
                {" "}
                {moment(order.orderDate).format("HH:mm A, DD/MM/YYYY")}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="font-semibold text-gray-600 text-base">
                Phương thức thanh toán:{" "}
              </Text>
              <Text className="font-semibold  max-w-[70%] text-gray-800 text-right text-base">
                {" "}
                {transaction.paymentMethod || "Không xác định"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-semibold text-gray-600 text-base">
                Tổng đơn:{" "}
              </Text>
              <Text className="font-semibold  max-w-[70%] text-gray-800 text-right text-base">
                {" "}
                {order.totalAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                })}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-semibold text-gray-600 text-base">
                Loại đơn hàng:{" "}
              </Text>
              <Text className="font-semibold  max-w-[70%] text-gray-800 text-right text-base">
                {" "}
                {order.orderType.vietnameseName}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-semibold text-gray-600 text-base">
                Ghi chú:{" "}
              </Text>
              <Text className="font-semibold  max-w-[70%] text-gray-800 text-right text-base">
                {" "}
                {order.note || "Không có ghi chú"}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View className="bg-white w-[48%] p-4 mt-4 rounded-lg">
          <Text className="text-lg uppercase font-bold border-b-2 border-[#C01D2E] mb-2">
            Thông tin khách hàng
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="font-semibold text-gray-600 text-base">
                Tên khách hàng:{" "}
              </Text>
              <Text className="font-semibold  max-w-[70%] text-gray-800 text-right text-base">
                {" "}
                {order.account.firstName} {order.account.lastName}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="font-semibold text-gray-600 text-base">
                Số điện thoại:{" "}
              </Text>
              <Text className="font-semibold  max-w-[70%] text-gray-800 text-right text-base">
                {" "}
                {order.account.phoneNumber}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="font-semibold text-gray-600 text-base">
                Email:{" "}
              </Text>
              <Text className="font-semibold  max-w-[70%] text-gray-800 text-right text-base">
                {" "}
                {order.account.email}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-semibold text-gray-600 text-base">
                Địa chỉ:{" "}
              </Text>
              <Text className="font-semibold  max-w-[70%] text-gray-800 text-right text-base">
                {" "}
                {order.customerInfoAddress.customerInfoAddressName}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Dishes List */}
      <View className="bg-white p-4 mt-4 rounded-lg">
        <Text className="text-lg font-bold uppercase border-b-2 border-red-700 mb-4">
          Danh sách món
        </Text>
        {/* Table Header */}
        <View className="flex-row justify-between bg-[#C01D2E] p-2">
          <Text className="flex-[0.5] text-center text-white font-semibold text-base">
            No
          </Text>
          <Text className="flex-[2] text-center text-white font-semibold text-base">
            Tên món
          </Text>
          <Text className="flex-[1] text-center text-white font-semibold text-base">
            Kích thước
          </Text>
          <Text className="flex-[1] text-center text-white font-semibold text-base">
            Số lượng
          </Text>
          <Text className="flex-[1] text-center text-white font-semibold text-base">
            Giá (VND)
          </Text>
          <Text className="flex-[1] text-center text-white font-semibold text-base">
            Giảm giá (%)
          </Text>
          <Text className="flex-[1] text-center text-white font-semibold text-base">
            Thành tiền
          </Text>
        </View>

        {/* Table Rows */}
        <View className="border-t border-gray-300">
          {orderDishes.length > 0 ? (
            orderDishes.map((dish, index) => {
              const totalPrice =
                dish.dishSizeDetail.price *
                dish.quantity *
                (1 - dish.dishSizeDetail.discount / 100);

              return (
                <View key={dish.orderDetailsId}>
                  <View
                    className={`flex flex-row justify-between p-2 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <Text className="flex-[0.5] text-center text-base">
                      {index + 1}
                    </Text>
                    <Text className="flex-[2] text-center font-bold  text-lg">
                      {dish.dishSizeDetail.dish.name}
                    </Text>
                    <Text className="flex-[1] text-center text-base">
                      {dish.dishSizeDetail.dishSize.vietnameseName}
                    </Text>
                    <Text className="flex-[1] text-center text-base">
                      {dish.quantity}
                    </Text>
                    <Text className="flex-[1] text-center text-base">
                      {dish.dishSizeDetail.price.toLocaleString("vi-VN")} VND
                    </Text>
                    <Text className="flex-[1] text-center text-base">
                      {dish.dishSizeDetail.discount}%
                    </Text>
                    <Text className="flex-[1] text-center text-base">
                      {totalPrice.toLocaleString("vi-VN")} VND
                    </Text>
                  </View>
                  <Text className="text-lg font-bold border-b-2 border-gray-300 mb-2"></Text>
                  {/* Total Information */}
                  <View className="text-right mt-1 mx-4">
                    <Text className="text-xl text-right font-semibold">
                      Tổng (đã bao gồm thuế và phí):{" "}
                      <Text className="text-red-700 font-bold text-2xl">
                        {(order.totalAmount ?? 0).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                        })}
                      </Text>
                    </Text>
                    <Text className="text-sm text-right text-gray-600">
                      Số tiền này đã bao gồm tất cả các loại thuế và phí bổ
                      sung.
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text className="italic text-center py-2">No dishes available</Text>
          )}
        </View>
      </View>

      {/* Footer */}
      <View className="bg-[#C01D2E] p-4 mt-4 rounded-b-lg">
        <Text className="text-white text-lg text-center font-semibold">
          Cảm ơn bạn đã chọn Nhà hàng Thiên Phú! Mọi thắc mắc xin vui lòng liên
          hệ bộ phận hỗ trợ của chúng tôi.
        </Text>
      </View>
    </ScrollView>
  );
};

export default InvoiceTable;
