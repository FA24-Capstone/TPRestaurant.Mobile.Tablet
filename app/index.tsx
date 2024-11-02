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
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
const beachImage = require("@/assets/meditation-images/bg-restaurant.jpeg");
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
import LoadingOverlay from "@/components/LoadingOverlay";
import { Ionicons } from "@expo/vector-icons";

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
  const [isLoading, setIsLoading] = useState(false);

  console.log("tableIdNe:", tableId);
  console.log("phoneNumberDatban:", phoneNumber);

  console.log(`Width: ${width}, Height: ${height}`);

  useEffect(() => {
    if (phoneNumber) {
      validatePhoneNumber(phoneNumber);
    }
  }, [phoneNumber]);

  useEffect(() => {
    const fetchReservation = async () => {
      if (tableId !== null && tableId !== undefined) {
        const now = moment()
          .tz("Asia/Ho_Chi_Minh")
          .format("YYYY-MM-DD HH:mm:ss.SSSSSSS");

        // Dispatch async thunk để fetch dữ liệu
        // dispatch(fetchReservationWithTime({ tableId, time: now }));
        dispatch(
          fetchReservationWithTime({
            tableId: tableId ?? "",
            // time: "2024-10-30T23:55:25.028Z",
            time: now,
          })
        );
      }
    };

    fetchReservation();
  }, [dispatch, tableId]);

  // Compute reservationText based on reservationData
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
    return `Xin chào quý khách, nếu quý khách đã đặt bàn số ${tableName} tại nhà hàng Thiên Phú thì xin vui lòng nhập số điện thoại đã đặt bàn vào phía dưới. Nếu không hãy bỏ qua nhé!`;
  }, [reservationData, tableName]);

  const handleStartExploring = async () => {
    try {
      setIsLoading(true);
      const now = moment()
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD HH:mm:ss.SSSSSSS");

      // Dispatch the fetchReservationWithTime action
      await dispatch(
        fetchReservationWithTime({
          tableId: tableId ?? "",
          time: now,
          // time: "2024-10-30T23:55:25.028Z",
        })
      );

      setIsLoading(false);
      setModalVisible(true);
    } catch (error) {
      setIsLoading(false);
      showErrorMessage("Có lỗi xảy ra khi lấy thông tin đặt bàn.");
    }
  };

  // useEffect(() => {
  //   if (isLoading) {
  //     if (reservationText) {
  //       setIsLoading(false);
  //       setModalVisible(true);
  //     } else {
  //       setIsLoading(false);
  //       router.push("/home-screen");
  //     }
  //   }
  // }, [isLoading, reservationText, router]);

  const isLandscape = width > height;

  console.log("isLandscape", isLandscape);

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{9,10}$/g; // Số điện thoại bắt đầu bằng 0 và có  chữ số
    if (!phoneRegex.test(phone)) {
      setPhoneError("Số điện thoại không đúng định dạng.");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handleConfirmPhoneNumber = async () => {
    if (reservationData && reservationData.result) {
      // If reservationData exists, verify the phone number
      if (phoneNumberOrder === phoneNumber) {
        setModalVisible(false);
        router.push("/home-screen");
        showSuccessMessage("Xác nhận đặt bàn thành công!");
      } else {
        showErrorMessage("Không tìm thấy đặt chỗ cho số điện thoại này.");
      }
    } else {
      // If no reservationData, save the phone number and navigate
      if (validatePhoneNumber(phoneNumber)) {
        // Save the phone number as needed, e.g., to Redux or AsyncStorage
        // For example:
        // await AsyncStorage.setItem("user_phone_number", phoneNumber);
        setModalVisible(false);
        router.push("/home-screen");
        showSuccessMessage("Số điện thoại đã được lưu!");
      } else {
        showErrorMessage("Vui lòng nhập số điện thoại hợp lệ.");
      }
    }
  };

  const handleSkip = () => {
    setModalVisible(false);
    router.push("/home-screen");
  };

  const isConfirmDisabled = !phoneNumber || phoneError !== null;

  const isDisabled = !phoneNumber || phoneError !== null;

  // QUAN LAMMMMM ================= Start

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getToken();
    }
  }
  const getToken = async () => {
    const token = await messaging().getToken();
    if (token) {
      await AsyncStorage.setItem("device_token", token);
      console.log("Your Firebase Token is:", token);
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);
  messaging().setBackgroundMessageHandler(async (message) => {
    console.log(message);
  });

  // QUAN LAMMMMM ================= End

  return (
    <>
      {isLoading && (
        <View>
          <LoadingOverlay visible={isLoading} />
        </View>
      )}
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
              onRequestClose={() => setModalVisible(false)}
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
                  <Text className="text-center mb-6 mt-2 uppercase font-extrabold text-2xl text-[#C01D2E]">
                    Xác nhận bàn đã được đặt
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "500",
                      marginBottom: 30,
                      textAlign: "center",
                    }}
                  >
                    {reservationText}
                  </Text>
                  <View className="flex-row items-center mx-auto">
                    <Text className="text-2xl mr-4 mb-2 text-[#C01D2E]">
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
                          width: 300,
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
                  <View className="flex-row justify-evenly mt-6 w-full items-center">
                    <TouchableOpacity
                      className={`my-2 w-[300px] p-2 rounded-lg ${
                        isConfirmDisabled ? "bg-gray-800" : "bg-[#C01D2E]"
                      }`}
                      onPress={handleConfirmPhoneNumber}
                      disabled={isConfirmDisabled}
                    >
                      <Text className="text-white text-center font-semibold text-xl uppercase">
                        Xác nhận
                      </Text>
                    </TouchableOpacity>
                    {/* Add the "Bỏ qua" button */}
                    <TouchableOpacity
                      className="my-2 w-[300px] p-2 rounded-lg flex-row items-center justify-center bg-gray-400"
                      onPress={handleSkip}
                    >
                      <Text className="text-white text-center font-semibold text-xl uppercase mr-2">
                        Bỏ qua
                      </Text>
                      <Ionicons name="arrow-forward" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </AppGradient>
        </ImageBackground>
      </View>
    </>
  );
};

export default App;
