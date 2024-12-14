import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { loginDevice } from "../../api/loginApi";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Checkbox } from "react-native-paper";
import { AppDispatch, RootState } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen: React.FC = () => {
  const [deviceCode, setDeviceCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState<"eye" | "eye-off">("eye"); // Explicitly type the state
  const [rememberMe, setRememberMe] = useState(false);
  // const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage the loading spinner

  const router = useRouter();
  const dispatch: AppDispatch = useDispatch<AppDispatch>(); // Định nghĩa kiểu cho dispatch
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/home-screen");
    }
  }, [isLoggedIn, router]);

  // Thêm useEffect để tải lại thông tin đăng nhập nếu "Remember Me" được chọn
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedRememberMe = await AsyncStorage.getItem("rememberMe");
        if (savedRememberMe === "true") {
          const savedDeviceCode = await AsyncStorage.getItem("deviceCode");
          const savedPassword = await AsyncStorage.getItem("password");
          if (savedDeviceCode && savedPassword) {
            const deviceCodeValue = savedDeviceCode;
            const passwordValue = savedPassword;
            if (deviceCodeValue && passwordValue) {
              setDeviceCode(deviceCodeValue);
              setPassword(passwordValue);
            }
            setRememberMe(true);
          }
        }
      } catch (error) {
        console.error("Failed to load saved credentials:", error);
      }
    };

    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!deviceCode || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginDevice(
        deviceCode,
        password,
        rememberMe,
        dispatch
      );
      // Với redux-persist, trạng thái sẽ được tự động lưu trữ dựa trên rememberMe
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Đăng nhập thất bại", "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordVisibility = () => {
    setRightIcon(rightIcon === "eye" ? "eye-off" : "eye");
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEnabled={true}
    >
      <ScrollView contentContainerStyle={{ flex: 1 }} className="bg-[#FFFFFF]">
        <View className="flex mx-auto my-auto bg-white w-full">
          <View className="mx-auto my-auto w-full">
            <Text className="text-center text-[#970C1A] text-4xl font-bold mb-6">
              NHÀ HÀNG THIÊN PHÚ
            </Text>
            <Text className="w-full text-center mb-7 text-slate-700 text-2xl italic">
              Chào mừng bạn trở lại, vui lòng đăng nhập
            </Text>
            <View className="w-[60%] mx-auto">
              <View className="px-3 mb-4">
                <Text className="mx-3 mb-5 text-xl text-slate-700 font-medium">
                  Mã Bàn
                </Text>
                <TextInput
                  placeholder="Nhập mã thiết bị"
                  value={deviceCode}
                  onChangeText={setDeviceCode}
                  className="border-[1px] border-slate-300 px-4 py-2 rounded-lg text-lg mx-7"
                />
              </View>
              <View className="my-3 px-3">
                <Text className="mb-5 mx-3 text-xl text-slate-700 font-medium">
                  Mật Khẩu
                </Text>
                <View className="flex flex-row mx-7 border-[1px] border-slate-300 p-2 rounded-lg w-fit">
                  <TextInput
                    placeholder="Nhập mật khẩu"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={passwordVisibility}
                    value={password}
                    onChangeText={setPassword}
                    className="w-[90%] text-lg ml-3 text-slate-400"
                  />
                  <TouchableOpacity
                    onPress={handlePasswordVisibility}
                    className="w-[10%] items-center mr-3"
                  >
                    <Feather name={rightIcon} size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember Me checkbox */}
              <View className="flex flex-row items-center mx-7 mt-3">
                <Checkbox
                  status={rememberMe ? "checked" : "unchecked"}
                  onPress={() => setRememberMe(!rememberMe)}
                />
                <Text className="ml-2 text-lg text-slate-700">
                  Ghi nhớ tài khoản này
                </Text>
              </View>

              <TouchableOpacity
                className="mx-auto mt-8 bg-[#970C1A] rounded-3xl"
                onPress={handleLogin}
              >
                <Text className="text-xl text-white px-11 py-2 font-semibold">
                  ĐĂNG NHẬP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Loading overlay */}
        {loading && (
          <View style={{ flex: 1 }}>
            <LoadingOverlay visible={loading} />
          </View>
        )}
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
