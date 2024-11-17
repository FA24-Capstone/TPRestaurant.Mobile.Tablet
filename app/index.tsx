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
  Linking,
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
import {
  fetchAccountByPhoneNumber,
  fetchReservationWithTime,
} from "@/api/reservationApi";
import { Button } from "react-native-paper";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { AppDispatch } from "@/redux/store";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Ionicons } from "@expo/vector-icons";
import { updateOrderStatus } from "@/api/ordersApi";

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
  // Đảm bảo state phoneNumber luôn khởi tạo với null
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneNumberOrder, setPhoneNumberOrder] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [accountError, seAccountError] = useState<string | null>(null);

  // Trạng thái để quản lý loại modal hiện tại
  const [currentModal, setCurrentModal] = useState<string | null>(null); // "reservationCheck" hoặc "phoneInput"

  console.log("tableIdNe:", tableId);
  console.log("phoneNumberDatban:", phoneNumber);

  console.log(`Width: ${width}, Height: ${height}`);

  useEffect(() => {
    if (phoneNumber) {
      validatePhoneNumber(phoneNumber);
    }
  }, [phoneNumber]);

  useEffect(() => {
    console.log("Current Modal Changed:", currentModal);
  }, [currentModal]);

  useEffect(() => {
    const fetchReservation = async () => {
      if (tableId !== null && tableId !== undefined) {
        const now = moment()
          .tz("Asia/Ho_Chi_Minh")
          .format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
        console.log("now", now);

        // Dispatch async thunk để fetch dữ liệu
        // dispatch(fetchReservationWithTime({ tableId, time: now }));
        dispatch(
          fetchReservationWithTime({
            tableId: tableId ?? "",
            // time: "2024-11-11 21:29:13.1140000",
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

  const handleStartExploring = () => {
    setCurrentModal("reservationCheck"); // Hiển thị modal kiểm tra đặt bàn
    setModalVisible(false); // Đảm bảo ẩn modal cũ
  };

  // Khi chuyển sang modal phoneVerification, reset phoneNumber về null
  const handleConfirmReservation = async (hasReservation: boolean) => {
    if (hasReservation) {
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
          })
        );

        setIsLoading(false);
        setPhoneNumber(""); // Reset phoneNumber về giá trị null
        setCurrentModal("phoneVerification");
      } catch (error) {
        setIsLoading(false);
        showErrorMessage("Có lỗi xảy ra khi lấy thông tin đặt bàn.");
      }
    } else {
      setCurrentModal("phoneInput");
    }
  };

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
      const orderId = reservationData.result.order.orderId; // Assuming the order ID is present in reservationData

      // If reservationData exists, verify the phone number
      setIsLoading(true);
      if (phoneNumberOrder === phoneNumber) {
        setModalVisible(false);
        const updateStatus = await updateOrderStatus(orderId, true, 5, true);
        if (updateStatus.isSuccess) {
          setCurrentModal(null);

          router.push("/home-screen");
          showSuccessMessage(
            "Xác nhận đặt bàn thành công và đơn hàng đã được chuyển trạng thái!"
          );
          setIsLoading(false);
        } else {
          showSuccessMessage(
            "Xác nhận đặt bàn thành công và đơn hàng chưa được chuyển trạng thái!"
          );
          setIsLoading(false);
          setCurrentModal(null);

          router.push("/home-screen");
        }
      } else {
        showErrorMessage("Không tìm thấy đặt chỗ cho số điện thoại này.");
        setIsLoading(false);
      }
    } else {
      // If no reservationData, save the phone number and navigate
      if (validatePhoneNumber(phoneNumber)) {
        // Save the phone number as needed, e.g., to Redux or AsyncStorage
        // For example:
        // await AsyncStorage.setItem("user_phone_number", phoneNumber);
        setModalVisible(false);
        setCurrentModal(null);

        router.push("/home-screen");
        showSuccessMessage("Số điện thoại đã được lưu!");
      } else {
        showErrorMessage("Vui lòng nhập số điện thoại hợp lệ.");
      }
    }
  };

  const handleConfirmPhoneNumberInModal = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      showErrorMessage("Vui lòng nhập số điện thoại hợp lệ.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchAccountByPhoneNumber({ phoneNumber })
      ).unwrap(); // Unwrap to handle success or error

      if (result?.isSuccess && result.result) {
        setIsLoading(false);
        showSuccessMessage("Tài khoản đã được xác nhận!");
        setCurrentModal(null);

        router.push("/home-screen"); // Navigate to home screen
      } else {
        setIsLoading(false);
        seAccountError(
          "Bạn chưa có account trên hệ thống, vui lòng tạo tài khoản trên website: "
        );
      }
    } catch (error) {
      setIsLoading(false);
      seAccountError(
        "Bạn chưa có account trên hệ thống, vui lòng tạo tài khoản trên website: "
      );
    }
  };

  const handleSkip = () => {
    setModalVisible(false);
    setCurrentModal(null);
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

  const closeModal = () => {
    setCurrentModal(null); // Đóng modal
  };

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

            {/* Modal kiểm tra đặt bàn */}
            {currentModal === "reservationCheck" && (
              <Modal
                animationType="slide"
                transparent={true}
                visible={currentModal === "reservationCheck"}
                onRequestClose={() => setCurrentModal(null)}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <View
                    style={{
                      width: width * 0.5,
                      backgroundColor: "white",
                      borderRadius: 20,
                      padding: 20,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../assets/Icons/iconAI.jpg")}
                      className="w-40 h-40 absolute -top-20 mx-auto"
                    />
                    <Text className="text-center mt-12 font-bold text-2xl mb-6">
                      Nhà hàng Thiên Phú xin chào quý khách!
                    </Text>
                    <Text className="text-center text-2xl mb-10 font-semibold text-gray-600">
                      Cho chúng tôi biết quý khách đã đặt bàn chưa?
                    </Text>
                    <View className="flex-row justify-evenly w-full mb-4">
                      <TouchableOpacity
                        className="bg-gray-400 rounded-lg w-[120px] py-3 "
                        onPress={() => handleConfirmReservation(false)}
                      >
                        <Text className="text-white text-lg font-semibold uppercase text-center">
                          Chưa
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="bg-[#C01D2E] rounded-lg w-[120px] py-3 "
                        onPress={() => handleConfirmReservation(true)}
                      >
                        <Text className="text-white text-lg font-semibold uppercase text-center">
                          Rồi
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {/* Modal nhập số điện thoại */}
            {currentModal === "phoneInput" && (
              <Modal
                animationType="slide"
                transparent={true}
                visible={currentModal === "phoneInput"}
                onRequestClose={() => setCurrentModal(null)}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <View
                    style={{
                      width: width * 0.6,
                      backgroundColor: "white",
                      borderRadius: 20,
                      padding: 20,
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setCurrentModal("reservationCheck")}
                      className="mb-2 absolute -top-14 left-0 w-[30%] p-2 rounded-lg flex-row items-center justify-center bg-white"
                    >
                      <Ionicons name="arrow-back" size={24} color="gray" />
                      <Text className="text-gray-500 text-center ml-4 font-semibold text-xl uppercase mr-2">
                        Quay lại
                      </Text>
                    </TouchableOpacity>
                    <Text className="text-center font-bold text-2xl my-6">
                      Bạn đã có tài khoản tại nhà hàng chưa?
                    </Text>
                    <Text className="text-center text-2xl mb-10 font-semibold text-gray-600">
                      Nếu có, vui lòng nhập số điện thoại để được tích điểm!
                    </Text>
                    <View>
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
                          className="no-wrap text-center"
                        >
                          {phoneError}
                        </Text>
                      )}
                      {accountError && (
                        <View>
                          <Text
                            style={{
                              color: "red",
                              marginBottom: 20,
                              textAlign: "center",
                            }}
                            className="text-xl mt-5 font-semibold"
                          >
                            {accountError}{" "}
                          </Text>
                          <Text
                            style={{
                              color: "#C01D2E",
                              textDecorationLine: "underline",
                              fontWeight: "bold",
                            }}
                            className="text-xl text-center font-semibold"
                            onPress={() =>
                              Linking.openURL(
                                "https://thienphurestaurant.vercel.app/"
                              )
                            }
                          >
                            Nhấn vào đây để tạo tài khoản.
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="flex-row justify-around mt-6 w-full items-center">
                      <TouchableOpacity
                        className={`my-2 w-[40%] p-2 rounded-lg ${
                          isDisabled ? "bg-gray-800" : "bg-[#C01D2E]"
                        }`}
                        onPress={handleConfirmPhoneNumberInModal}
                        disabled={isDisabled}
                      >
                        <Text className="text-white text-center font-semibold text-xl uppercase">
                          Xác nhận
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="my-2 w-[40%] p-2 rounded-lg flex-row items-center justify-center bg-gray-400"
                        onPress={() => {
                          setCurrentModal(null);
                          handleSkip();
                        }}
                      >
                        <Text className="text-white text-center font-semibold text-xl uppercase mr-2">
                          Bỏ qua
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={24}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {/* Modal xác nhận đặt bàn (modal cũ) */}
            {currentModal === "phoneVerification" && (
              <Modal
                animationType="slide"
                transparent={true}
                visible={currentModal === "phoneVerification"}
                onRequestClose={closeModal}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                    <TouchableOpacity
                      onPress={() => setCurrentModal("reservationCheck")}
                      className="mb-2 absolute -top-14 left-0 w-[30%] p-2 rounded-lg flex-row items-center justify-center bg-white"
                    >
                      <Ionicons name="arrow-back" size={24} color="gray" />
                      <Text className="text-gray-500 text-center ml-4 font-semibold text-xl uppercase mr-2">
                        Quay lại
                      </Text>
                    </TouchableOpacity>
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
                      <TouchableOpacity
                        className="my-2 w-[300px] p-2 rounded-lg flex-row items-center justify-center bg-gray-400"
                        onPress={() => {
                          closeModal;
                          setCurrentModal(null);

                          handleSkip();
                        }}
                      >
                        <Text className="text-white text-center font-semibold text-xl uppercase mr-2">
                          Bỏ qua
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={24}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}
          </AppGradient>
        </ImageBackground>
      </View>
    </>
  );
};

export default App;
