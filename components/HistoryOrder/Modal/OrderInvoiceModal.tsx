import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  Linking,
} from "react-native";
import moment from "moment-timezone";
import { OrderDish } from "@/app/types/order_type";
import { formatPriceVND } from "@/components/Format/formatPrice";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { createPayment, makeDineInOrderBill } from "@/api/paymentApi";
import ChoosePaymentModal from "@/components/Payment/ChoosePayment";
import SuccessModal from "@/components/Payment/SuccessModal";
import LoadingOverlay from "@/components/LoadingOverlay";
import OrderDetails from "./OrderInfo";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { Coupon, ItemCoupons } from "@/app/types/coupon_type";

interface OrderInvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onOpen: () => void;
  customerName: string;
  customerPhone: string;
  mealTime: string;
  numOfPeople: number;
  tableName: string;
  orderId: string;
  orderDetails: OrderDish[];
  currentOrder: any;
}

const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  visible,
  onClose,
  onOpen,
  customerName,
  customerPhone,
  mealTime,
  numOfPeople,
  tableName,
  orderId,
  orderDetails,
  currentOrder,
}) => {
  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );
  const accountByPhone = useSelector((state: RootState) => state.account.data);

  const [loading, setLoading] = useState(false);
  const [choosePaymentVisible, setChoosePaymentVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon[] | undefined>(
    undefined
  );
  const [usePoints, setUsePoints] = useState(false);

  console.log("selectedCoupon", selectedCoupon);

  const getStatusInfo = (statusId: any) => {
    const statusMapping = {
      1: { colorClass: "text-blue-800", text: "Đã đặt bàn" },
      2: { colorClass: "text-purple-800", text: "Đã thanh toán đặt cọc" },
      3: { colorClass: "text-green-800", text: "Đang dùng bữa" },
      4: { colorClass: "text-orange-800", text: "Chờ xử lý" },
      5: { colorClass: "text-yellow-800", text: "Đang xử lý" },
      6: { colorClass: "text-cyan-800", text: "Sẵn sàng giao hàng" },
      7: { colorClass: "text-indigo-800", text: "Đã chỉ định cho shipper" },
      8: { colorClass: "text-teal-800", text: "Đang giao hàng" },
      9: { colorClass: "text-gray-800", text: "Đã hoàn thành" },
      10: { colorClass: "text-red-800", text: "Đã hủy" },
    };
    return (
      statusMapping[statusId] || {
        colorClass: "text-green-800",
        text: "Đang dùng bữa",
      }
    );
  };

  const statusInfo = getStatusInfo(
    reservationData?.result?.order?.statusId || currentOrder?.statusId
  );

  const totalAmount = orderDetails
    .filter((item) => item.status.id !== 5)
    .reduce((total, item) => {
      const price =
        item.dishSizeDetail?.price || item.comboDish?.combo.price || 0;
      const discount =
        (item.dishSizeDetail?.discount ||
          item.comboDish?.combo?.discount ||
          0) / 100;
      const discountedPrice = price * (1 - discount); // Giá sau khi trừ discount
      return total + discountedPrice * item.quantity;
    }, 0);

  const grandTotal =
    totalAmount -
    (reservationData?.result?.order?.deposit || 0) -
    (totalAmount *
      (selectedCoupon?.reduce(
        (acc, coupon) => acc + (coupon.couponProgram.discountPercent || 0),
        0
      ) || 0)) /
      100;

  console.log("totalAmount", totalAmount);

  // Tính số điểm tối đa áp dụng (10% của grandTotal)
  const maxPointsDiscount = Math.min(
    grandTotal * 0.1,
    accountByPhone?.loyalPoint ||
      reservationData?.result?.order?.account?.loyaltyPoint ||
      0
  );
  const grandTotalUsePoint = grandTotal - maxPointsDiscount;

  const handlePayment = async (paymentMethod: number) => {
    setLoading(true);
    try {
      const paymentRequest: any = {
        orderId,
        cashReceived: 0,
        changeReturned: 0,
        paymentMethod,
        couponIds: selectedCoupon?.map((coupon) => coupon.couponId),
        chooseCashRefund: true,
      };
      console.log("paymentRequest", paymentRequest);
      // Conditionally add accountId if it exists
      if (accountByPhone?.id) {
        paymentRequest.accountId = accountByPhone.id;
      }
      // Conditionally add loyalPointsToUse if usePoints is true
      if (usePoints && accountByPhone?.loyalPoint) {
        paymentRequest.loyalPointsToUse = maxPointsDiscount;
      }

      // Call API
      const response = await makeDineInOrderBill(paymentRequest);

      if (response.isSuccess) {
        // Online payment (VNPay or Momo)
        if (response.result?.paymentLink) {
          Linking.openURL(response.result.paymentLink).catch((err) => {
            console.error("Failed to open payment URL:", err);
            showErrorMessage("Không thể mở liên kết thanh toán.");
          });
        } else {
          showErrorMessage("Không thể lấy liên kết thanh toán.");
        }
        onClose();
      } else {
        const errorMessage =
          response.messages?.[0] || "Tạo thanh toán thất bại.";
        showErrorMessage(errorMessage);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      showErrorMessage("Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View>
        <LoadingOverlay visible={loading} />
      </View>
      <Modal transparent={true} visible={visible} onDismiss={onClose}>
        <View className="flex-1 justify-center items-center bg-[#22222391] bg-opacity-50">
          <View className="bg-white w-[850px] h-[85%] rounded-lg py-6 px-10">
            <Text className="font-bold text-2xl text-center mt-4 mb-6 text-[#C01D2E] uppercase">
              Tổng hoá đơn đặt món tại bàn
            </Text>

            {/* Use FlatList for the entire modal content */}
            <FlatList
              data={orderDetails.filter((item) => item.status.id !== 5)}
              keyExtractor={(item) => item.orderDetailsId}
              ListHeaderComponent={() => (
                <OrderDetails
                  customerName={customerName}
                  customerPhone={customerPhone}
                  mealTime={mealTime}
                  numOfPeople={numOfPeople}
                  tableName={tableName}
                  orderId={orderId}
                  reservationData={reservationData || undefined}
                  statusInfo={statusInfo}
                  setSelectedCoupon={setSelectedCoupon}
                  selectedCoupon={selectedCoupon}
                  totalAmount={totalAmount}
                  setUsePoints={setUsePoints}
                  usePoints={usePoints}
                  grandTotal={grandTotal}
                />
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
                      className=" h-10 w-12 rounded mr-4"
                    />
                    <Text className="font-semibold">
                      {item.dishSizeDetail?.dish.name ||
                        item.comboDish?.combo.name}
                    </Text>
                  </View>
                  <Text className="w-16 ml-4 text-left">
                    {item.dishSizeDetail?.dishSize?.name === "LARGE"
                      ? "LỚN"
                      : item.dishSizeDetail?.dishSize?.name === "MEDIUM"
                      ? "VỪA"
                      : item.dishSizeDetail?.dishSize?.name === "SMALL"
                      ? "NHỎ"
                      : "COMBO"}
                  </Text>
                  <Text className="w-20 text-center">
                    {formatPriceVND(
                      item.dishSizeDetail?.price ||
                        item.comboDish?.combo.price ||
                        0
                    )}
                  </Text>
                  <Text className="w-10 text-center">
                    {item?.dishSizeDetail?.discount ||
                      item.comboDish?.combo?.discount ||
                      0}
                    %
                  </Text>

                  <Text className="w-10 text-center">{item.quantity}</Text>
                  <Text className="w-20 text-center font-semibold">
                    {formatPriceVND(
                      (item.dishSizeDetail?.price ||
                        item.comboDish?.combo.price ||
                        0) *
                        (1 -
                          (item.dishSizeDetail?.discount ||
                            item.comboDish?.combo?.discount ||
                            0) /
                            100) *
                        item.quantity
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

                    {selectedCoupon && selectedCoupon?.length > 0 && (
                      <View className="flex-row justify-between mt-2">
                        <Text className="font-semibold text-gray-700">
                          Dùng Coupon:
                        </Text>
                        <Text className="font-semibold  text-gray-800">
                          -{" "}
                          {formatPriceVND(
                            totalAmount *
                              (selectedCoupon.reduce(
                                (acc, coupon) =>
                                  acc +
                                  (coupon.couponProgram.discountPercent || 0),
                                0
                              ) /
                                100)
                          )}
                        </Text>
                      </View>
                    )}
                    {usePoints && maxPointsDiscount > 0 && (
                      <View className="flex-row justify-between mt-2">
                        <Text className="font-semibold text-gray-700">
                          Dùng Điểm:
                        </Text>
                        <Text className="font-semibold  text-gray-800">
                          - {formatPriceVND(maxPointsDiscount)}
                        </Text>
                      </View>
                    )}
                    <View className="flex-row justify-between mt-2">
                      <Text className="font-semibold text-xl text-[#C01D2E]">
                        Tổng cộng:
                      </Text>
                      <Text className="font-semibold text-xl text-[#C01D2E]">
                        {formatPriceVND(
                          Math.ceil(
                            (usePoints ? grandTotalUsePoint : grandTotal) / 1000
                          ) * 1000
                        )}
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
                onPress={() => setChoosePaymentVisible(true)}
              >
                <Text className="text-white text-center font-semibold text-lg uppercase">
                  {loading ? "Đang xử lý..." : "Thanh toán ngay"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ChoosePaymentModal
        visible={choosePaymentVisible}
        onClose={() => setChoosePaymentVisible(false)}
        onConfirmPayment={(method) => {
          setChoosePaymentVisible(false);
          handlePayment(method);
        }}
      />
      {/* Success Modal */}
      <SuccessModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        onOpen={() => onOpen()} // Define this function to show the invoice details
        successMessage={successMessage}
      />
    </>
  );
};

export default OrderInvoiceModal;
