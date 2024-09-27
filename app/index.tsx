import {
  View,
  Text,
  Image,
  ImageBackground,
  useWindowDimensions,
  Dimensions,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";
import AppGradient from "@/components/AppGradient";
import { useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInUp,
  withSpring,
} from "react-native-reanimated";

import beachImage from "../assets/meditation-images/bg-restaurant.jpg";
import { NativeWindStyleSheet } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import moment from "moment-timezone";
import { fetchReservationWithTime } from "@/api/reservationApi";
import { Button } from "react-native-paper";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { AppDispatch } from "@/redux/store";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const App = () => {
  const { deviceId, deviceCode, tableId, tableName } = useSelector(
    (state: RootState) => state.auth
  );
  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );
  // console.log("reservationDataNe", reservationData);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { width, height } = Dimensions.get("window");

  // const [reservationText, setReservationText] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneNumberOrder, setPhoneNumberOrder] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  console.log("tableIdNe:", tableId);

  console.log(`Width: ${width}, Height: ${height}`);

  useEffect(() => {
    if (phoneNumber) {
      validatePhoneNumber(phoneNumber);
    }
  }, [phoneNumber]);

  useEffect(() => {
    const fetchReservation = async () => {
      if (tableId) {
        const now = moment()
          .tz("Asia/Ho_Chi_Minh")
          .format("YYYY-MM-DD HH:mm:ss.SSSSSSS");

        // Dispatch async thunk để fetch dữ liệu
        // dispatch(fetchReservationWithTime({ tableId, time: now }));
        dispatch(
          fetchReservationWithTime({
            tableId,
            time: "2024-09-28 23:10:44.3000000",
          })
        );
      }
    };

    fetchReservation();
  }, [dispatch, tableId]);

  // Tính toán reservationText dựa trên dữ liệu từ Redux store
  const reservationText = useMemo(() => {
    if (reservationData && reservationData.result) {
      const reservation = reservationData.result.order;
      const customerName = reservation?.account?.lastName
        ? `${reservation.account.firstName} ${reservation.account.lastName}`
        : "ẩn danh";

      const reservationTime = moment(reservation.mealTime).format(
        "HH:mm A, DD/MM/YYYY"
      );

      setPhoneNumberOrder(reservation.account.phoneNumber);

      return `Bàn số ${tableName} đã có quý khách ${customerName} đặt bàn vào lúc ${reservationTime}. Nếu quý khách hàng đã tới nhận bàn, hãy nhập số điện thoại đã đặt bàn để tiến hành dùng bữa tại nhà hàng Thiên Phú. Chúc quý khách hàng dùng bữa ngon miệng!`;
    }
    return "";
  }, [reservationData, tableName]);

  const handleStartExploring = () => {
    if (reservationText !== "" || reservationText !== null) {
      setModalVisible(true);
    } else {
      // setModalVisible(true);
      router.push("/home-screen");
    }
  };

  const isLandscape = width > height;

  console.log("isLandscape", isLandscape);

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{9,10}$/g; // Số điện thoại bắt đầu bằng 0 và có  chữ số
    if (!phoneRegex.test(phone)) {
      setPhoneError(
        "Số điện thoại không hợp lệ. Số điện thoại phải có ít nhất 9 và nhiều nhất 10 chữ số."
      );
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handleConfirmPhoneNumber = async () => {
    if (phoneNumberOrder && phoneNumberOrder === phoneNumber) {
      // Proceed to the next screen or show success message
      setModalVisible(false);
      router.push("/home-screen");
    } else {
      showErrorMessage("Không tìm thấy đặt chỗ cho số điện thoại này.");
    }
  };

  const isDisabled = !phoneNumber || phoneError !== null;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ImageBackground
        source={beachImage}
        resizeMode="cover"
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <AppGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}>
          <SafeAreaView className="flex flex-1 px-1 justify-between">
            <Animated.View
              entering={FadeInDown.delay(300)
                .mass(0.5)
                .stiffness(80)
                .springify(20)}
            >
              <Text className="text-center text-white font-bold text-4xl">
                Nhà Hàng Thiên Phú Xin Kinh Chào Quý Khách!
              </Text>
              <Text className="text-center text-white font-regular text-2xl mt-3">
                Đến đây để thưởng thức những điều tuyệt vời nhất
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(300)
                .mass(0.5)
                .stiffness(80)
                .springify(20)}
            >
              <CustomButton
                onPress={handleStartExploring}
                title="BẮT ĐẦU KHÁM PHÁ"
              />
            </Animated.View>

            <StatusBar style="light" />
          </SafeAreaView>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 100,
              }}
            >
              <View
                style={{
                  width: width * 0.8,
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 20,
                  alignItems: "center",
                }}
              >
                <Text className="text-center mb-6 mt-2 font-bold text-2xl text-yellow-700">
                  THÔNG BÁO BÀN ĐÃ ĐƯỢC ĐẶT
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    marginBottom: 40,
                    textAlign: "center",
                  }}
                >
                  {reservationText}
                </Text>
                <View className="flex-row  items-center mx-auto">
                  <Text className=" text-2xl mr-4 mb-2 text-[#C01D2E]">
                    +84
                  </Text>
                  <View>
                    <TextInput
                      placeholder="Nhập số điện thoại"
                      value={phoneNumber}
                      onChangeText={(text) => {
                        setPhoneNumber(text);
                      }}
                      keyboardType="phone-pad"
                      maxLength={10}
                      style={{
                        width: 250,
                        height: 45,
                        borderColor: phoneError ? "red" : "gray",
                        borderWidth: 1,
                        marginBottom: 5,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        fontSize: 24,
                        color: "#C01D2E",
                      }}
                    />
                  </View>
                </View>
                {phoneError && (
                  <Text
                    style={{ color: "red", marginBottom: 20 }}
                    className="no-wrap"
                  >
                    {phoneError}
                  </Text>
                )}
                <TouchableOpacity
                  className={`my-2 w-[200px] p-2 rounded-lg ${
                    isDisabled ? "bg-[#8B4513]" : "bg-[#C01D2E]"
                  }`}
                  onPress={handleConfirmPhoneNumber}
                  disabled={isDisabled}
                >
                  <Text className="text-white text-center font-semibold text-lg uppercase">
                    Xác nhận
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </AppGradient>
      </ImageBackground>
    </View>
  );
};

export default App;
