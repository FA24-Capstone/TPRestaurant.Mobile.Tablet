import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { Asset } from "expo-asset";
import { PaymentDetailReponse } from "./types/payment_type";
import { getPaymentById } from "@/api/paymentApi";
import InvoiceTable from "@/components/Payment/InvoiceTable";
import LoadingOverlay from "@/components/LoadingOverlay";

Asset.loadAsync(require("../assets/Icons/iconAI.jpg"));

type RouteParams = {
  TransactionScreen: {
    isSuccess?: string;
    transactionId?: string;
  };
};

const TransactionScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const route = useRoute<RouteProp<RouteParams, "TransactionScreen">>();
  const [paymentDetails, setPaymentDetails] =
    useState<PaymentDetailReponse | null>(null);
  const { isSuccess, transactionId } = route.params || {};
  const [loading, setLoading] = useState(true);

  // console.log("isSuccess", isSuccess, "transactionId", transactionId);

  const transactionIdNE =
    transactionId || "c50560f8-81c6-4eec-bb14-aaa4f8b2e19c";
  useEffect(() => {
    if (transactionIdNE) {
      const fetchPaymentDetails = async () => {
        try {
          // const data = await getPaymentById(transactionId);
          const data = await getPaymentById(transactionIdNE);
          setPaymentDetails(data);
        } catch (error) {
          console.error("Error fetching payment details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPaymentDetails();
    }
  }, [transactionIdNE]);

  const handleLogout = () => {
    dispatch(logout());
  };

  // // Tự động logout sau 1 phút nếu không có hành động gì
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleLogout();
    }, 60000); // 60000 ms = 1 phút

    return () => clearTimeout(timeout); // Clear timeout nếu người dùng hành động
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

      <TouchableOpacity
        className=" bg-[#C01D2E] absolute top-10 right-10 mb-10 p-2 rounded-lg w-[200px] self-center"
        onPress={handleLogout}
      >
        <Text className="text-white text-center font-semibold text-lg uppercase">
          Thoát ra
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TransactionScreen;
