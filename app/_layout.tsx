import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as ExpoSplashScreen from "expo-splash-screen"; // Sử dụng alias để tránh xung đột tên

import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { Provider } from "react-redux";
import store, { persistor, RootState } from "@/redux/store";
import CustomHeader from "@/components/CustomHeader";
import CustomDrawerContent from "@/components/CustomDrawerContent"; // Import your custom drawer content
import Colors from "@/constants/Colors";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import LoginScreen from "./(tabs)/login";
import FlashMessage from "react-native-flash-message";
import { PersistGate } from "redux-persist/integration/react";
import LoadingOverlay from "@/components/LoadingOverlay";
import * as SecureStore from "expo-secure-store";
import { LoginResponse } from "./types/login_type";
import axios from "axios";
import { login } from "@/redux/slices/authSlice";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const Drawer = createDrawerNavigator();
const NativeStack = createNativeStackNavigator();

ExpoSplashScreen.preventAutoHideAsync(); // Sử dụng alias để tránh xung đột tên

function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        header: ({ route }) => {
          const routeName = route.name;
          const title =
            route.name === "home-screen"
              ? "Home"
              : route.name === "list-dish"
              ? "Menu"
              : route.name === "history-order"
              ? "Lịch sử đặt món"
              : // : route.name === "feedback"
              // ? "Đánh giá"
              route.name === "setting"
              ? "Cài đặt"
              : "Lịch sử đặt món"; // Fallback title if route doesn't match
          return <CustomHeader title={title} />;
        },
        drawerActiveTintColor: "#FFFFFF", // Màu chữ khi active
        drawerInactiveTintColor: "#FFFFFF", // Màu chữ khi inactive
        drawerStyle: {
          backgroundColor: "#970C1A", // Màu nền
        },
        drawerLabelStyle: {
          color: "#FFFFFF", // Màu chữ
        },
      }}
    >
      <Drawer.Screen
        name="home-screen"
        component={require("./(tabs)/home-screen").default}
        options={{
          drawerLabel: "HOME",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="flower-tulip"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="list-dish"
        component={require("./(tabs)/list-dish").default}
        options={{
          drawerLabel: "MENU",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="book" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="history-order"
        component={require("./(tabs)/history-order").default}
        options={{
          drawerLabel: "LỊCH SỬ ĐẶT MÓN",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" size={24} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="feedback"
        component={require("./(tabs)/feedback").default}
        options={{
          drawerLabel: "ĐÁNH GIÁ",
          drawerIcon: ({ color }) => (
            <Entypo name="star" size={24} color={color} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="setting"
        component={require("./(tabs)/setting").default}
        options={{
          drawerLabel: "CÀI ĐẶT",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
  });

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const deviceId = await SecureStore.getItemAsync("deviceId"); // Lấy deviceId từ SecureStore

        if (token && deviceId) {
          // Nếu token và deviceId tồn tại, gọi API để lấy thông tin thiết bị
          console.log(
            `Making request to: ${API_URL}/device/get-device-by-id/${deviceId}`
          );
          const response = await axios.get<LoginResponse>(
            `${API_URL}/device/get-device-by-id/${deviceId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            const data = response.data.result;
            dispatch(
              login({
                token: token,
                deviceResponse: {
                  deviceId: data.deviceResponse.deviceId,
                  deviceCode: data.deviceResponse.deviceCode,
                  tableId: data.deviceResponse.tableId,
                  tableName: data.deviceResponse.tableName,
                  mainRole: data.mainRole,
                },
                rememberMe: true, // Đặt rememberMe là true vì token được lưu trong SecureStore
              })
            );
          } else {
            // Nếu token không hợp lệ, xóa nó cùng với deviceId
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("deviceId");
            await SecureStore.deleteItemAsync("password");
            await SecureStore.deleteItemAsync("rememberMe");
          }
        }
      } catch (error) {
        console.error("Failed to load token from SecureStore:", error);
      } finally {
        ExpoSplashScreen.hideAsync();
      }
    };

    if (fontsLoaded) {
      loadToken();
    }
  }, [fontsLoaded, dispatch]);

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) ExpoSplashScreen.hideAsync(); // Sử dụng alias
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      {isLoggedIn ? (
        <NativeStack.Navigator>
          <NativeStack.Screen
            name="index"
            component={require("./index").default}
            options={{ headerShown: false }}
          />
          <NativeStack.Screen
            name="(tabs)"
            component={MyDrawer}
            options={{ headerShown: false }}
          />
          <NativeStack.Screen
            name="meditate/[id]"
            component={require("./meditate/[id]").default}
            options={{ headerShown: false }}
          />
          <NativeStack.Screen
            name="(modal)/adjust-meditation-duration"
            component={require("./(modal)/adjust-meditation-duration").default}
            options={{ headerShown: false, presentation: "modal" }}
          />
          <NativeStack.Screen
            name="transaction"
            component={require("./transaction").default}
            options={{ headerShown: false }}
          />
        </NativeStack.Navigator>
      ) : (
        <LoginScreen />
      )}
      <FlashMessage style={{ zIndex: 999 }} />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<LoadingOverlay visible={true} />}
        persistor={persistor}
      >
        <RootLayout />
      </PersistGate>
    </Provider>
  );
}
