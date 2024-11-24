import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { Asset } from "expo-asset";
import { PaymentDetailReponse } from "./types/payment_type";
import { createPayment, getPaymentById } from "@/api/paymentApi";
import InvoiceTable from "@/components/Payment/InvoiceTable";
import LoadingOverlay from "@/components/LoadingOverlay";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { StackNavigationProp } from "@react-navigation/stack";
import { clearReservationData } from "@/redux/slices/reservationSlice";
import { clearDishes } from "@/redux/slices/dishesSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "@/redux/store";

Asset.loadAsync(require("../assets/Icons/iconAI.jpg"));

type RouteParams = {
  TransactionScreen: {
    isSuccess?: string;
    transactionId?: string;
  };
};

type RootStackParamList = {
  index: undefined;
};

const TransactionScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RouteParams, "TransactionScreen">>();
  const [paymentDetails, setPaymentDetails] =
    useState<PaymentDetailReponse | null>(null);
  const { isSuccess, transactionId } = route.params || {};
  const [loading, setLoading] = useState(true);

  const transactionIdNE =
    transactionId || "e53e2d5e-b0a0-4922-9763-04a584daf30b";

  console.log("isSuccess", isSuccess, "transactionId", transactionIdNE);
  useEffect(() => {
    if (transactionIdNE) {
      setLoading(true);
      const fetchPaymentDetails = async () => {
        try {
          // const data = await getPaymentById(transactionId);
          const data = await getPaymentById(transactionIdNE); // Call API to fetch payment details

          console.log("datagetPaymentById", data);

          if (data.isSuccess) {
            setPaymentDetails(data); // Update the state with payment details
            showSuccessMessage("Payment details fetched successfully!");
          } else {
            const errorMessage =
              data.messages?.[0] || "Failed to fetch payment details.";
            showErrorMessage(errorMessage);
          }
        } catch (error) {
          setLoading(false);

          console.error("Error fetching payment details:", error);
          showErrorMessage("An error occurred while fetching payment details.");
        } finally {
          setLoading(false);
        }
      };

      fetchPaymentDetails();
    } else {
      setLoading(false);
    }
  }, [transactionIdNE]);

  const handleRetryPayment = async () => {
    try {
      const paymentRequest = {
        orderId: paymentDetails?.result.order.order.orderId || "", // Sử dụng transactionId từ route hoặc state
        paymentMethod: paymentDetails?.result.transaction.paymentMethodId || 1, // Ví dụ: 1 có thể là một phương thức thanh toán cụ thể
        accountId: paymentDetails?.result?.order?.order?.accountId || undefined, // Truyền nếu có accountId
      };

      const response = await createPayment(paymentRequest);

      if (response.isSuccess && response.result) {
        showSuccessMessage("Redirecting to payment gateway...");
        Linking.openURL(response.result); // Mở liên kết trong trình duyệt
      } else {
        const errorMessage =
          response.messages?.[0] || "Failed to initiate retry payment.";
        showErrorMessage(errorMessage);
      }
    } catch (error) {
      console.error("Error during retry payment:", error);
      showErrorMessage("An error occurred while retrying payment.");
    }
  };

  const handleLogout = () => {
    // Dispatch actions to clear reservation and dish data
    dispatch(clearReservationData());
    dispatch(clearDishes());
    // Xác nhận dữ liệu đã bị xóa trong Redux
    console.log("Reservation data cleared:", store.getState().reservation.data);

    // Navigate to the "index" screen
    navigation.navigate("index");
  };

  // Tự động logout sau 1 phút nếu không có hành động gì
  useEffect(() => {
    if (isSuccess === "true") {
      const timeout = setTimeout(() => {
        handleLogout();
      }, 60000); // 60000 ms = 1 phút

      return () => clearTimeout(timeout); // Clear timeout nếu người dùng hành động
    } // Không tự động logout nếu thanh toán thành công
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1, // Cho phép nội dung cuộn khi không đủ chiều cao
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
      }}
      className="relative"
    >
      {isSuccess === "true" ? (
        <>
          <View className="mb-3">
            <Image
              source={require("../assets/Icons/iconAI.jpg")}
              className="w-40 h-40 mx-auto"
            />
          </View>
          <Text className="uppercase text-green-500 text-xl mb-4 mt-2 text-center font-bold">
            Thanh toán hoá đơn thành công!
          </Text>
          {/* <Text>
            TRANSACTIONID: {transactionIdNE ?? " chả có transactionid"}
          </Text> */}
          <Text className="font-semibold text-lg text-gray-600 text-center w-[70%] mb-8">
            Nhà hàng Thiên phú xin cảm ơn quý khách đã sử dụng và trải nghiệm
            dịch vụ ăn uống tại nhà hàng. Nếu có thiếu sót thì mong khách hàng
            đánh giá phản hồi qua website hoặc nhân viên tư vấn tại cửa hàng.
            Chúc quý khách hàng nhiều sức khoẻ và thịnh vượng!
          </Text>
          {loading ? (
            <View>
              <LoadingOverlay visible={loading} />
            </View>
          ) : (
            <InvoiceTable paymentDetails={paymentDetails} />
          )}

          {/* <Button title="Thoát ra" onPress={handleLogout} /> */}
        </>
      ) : isSuccess === "false" ? (
        <>
          <View className="mb-3">
            <Image
              source={require("../assets/Icons/iconAIsad.jpg")}
              className="w-40 h-40 mx-auto"
            />
          </View>
          <Text className="uppercase text-red-600 text-xl mb-4 mt-2 text-center font-bold">
            Ôi, có vẻ bạn chưa thanh toán thành công.
          </Text>
          {/* <Text>TRANSACTIONID: {transactionId ?? " chả có transactionid"}</Text> */}

          <Text className="font-semibold text-lg text-gray-600 text-center w-[70%] mb-8">
            Bạn vui lòng gặp nhân viên hoặc ra quầy thanh toán để thanh toán lại
            hoá đơn. Nhà hàng Thiên Phú xin lỗi vì sự cố bất tiện này.
          </Text>
          {loading ? (
            <View>
              <LoadingOverlay visible={loading} />
            </View>
          ) : (
            <InvoiceTable paymentDetails={paymentDetails} />
          )}
        </>
      ) : (
        <>
          <View className="mb-3">
            <Image
              source={require("../assets/Icons/iconAIsad.jpg")}
              className="w-40 h-40 mx-auto"
            />
          </View>
          <Text className="uppercase text-red-600 text-xl mb-4 mt-2 text-center font-bold">
            Ôi, có vẻ đã có sai sót!
          </Text>
        </>
      )}

      {isSuccess === "true" ? (
        <TouchableOpacity
          className=" bg-[#C01D2E] absolute top-10 right-10 mb-10 p-2 rounded-lg w-[200px] self-center"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-semibold text-lg uppercase">
            Thoát ra
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className=" bg-[#EDAA16] absolute top-10 right-10  mb-10 p-2 rounded-lg w-[200px] self-center"
          onPress={handleRetryPayment}
        >
          <Text className="text-white text-center font-semibold uppercase text-lg">
            Thanh toán lại
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default TransactionScreen;
