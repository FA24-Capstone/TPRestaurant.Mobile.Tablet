import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { loginDevice } from "../../api/loginApi";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { Feather } from "@expo/vector-icons";

const LoginScreen: React.FC = () => {
  const [deviceCode, setDeviceCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState<"eye" | "eye-off">("eye"); // Explicitly type the state
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);

  const handleLogin = async () => {
    try {
      await loginDevice(deviceCode, password, dispatch);
      setIsLoginSuccessful(true);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Đăng nhập thất bại", "Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    if (isLoginSuccessful) {
      router.push("/home-screen");
    }
  }, [isLoginSuccessful, router]);

  const handlePasswordVisibility = () => {
    setRightIcon(rightIcon === "eye" ? "eye-off" : "eye");
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }} className="bg-[#FFFFFF]">
      <View className="flex mx-auto my-auto bg-white w-full h-full">
        <View className="mx-auto my-auto w-full">
          {/* <Image
            source={require("../../../assets/jewelryLogo.png")}
            className="w-[160px] h-[120px] items-center mx-auto mb-2"
          /> */}
          <Text className="text-center text-[#970C1A] text-4xl  font-bold mb-6">
            NHÀ HÀNG THIÊN PHÚ
          </Text>
          <Text className="w-full text-center mb-7 text-slate-700 text-2xl italic">
            Chào mừng bạn trở lại, vui lòng đăng nhập
          </Text>
          <View className="w-[60%] mx-auto">
            <View className="px-3  mb-4">
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
                  className="w-[90%] text-lg ml-3  text-slate-400"
                />
                <TouchableOpacity
                  onPress={handlePasswordVisibility}
                  className="w-[10%] items-center mr-3"
                >
                  <Feather name={rightIcon} size={24} color="black" />
                </TouchableOpacity>
              </View>
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
    </ScrollView>
  );
};

export default LoginScreen;
