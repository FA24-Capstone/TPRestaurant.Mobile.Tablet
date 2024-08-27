import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import store, { RootState } from "@/redux/store";
import CustomHeader from "@/components/CustomHeader";
import CustomDrawerContent from "@/components/CustomDrawerContent"; // Import your custom drawer content
import Colors from "@/constants/Colors";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import LoginScreen from "./(tabs)/login";
import FlashMessage from "react-native-flash-message";

const Drawer = createDrawerNavigator();
const NativeStack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

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
              : route.name === "feedback"
              ? "Đánh giá"
              : route.name === "setting"
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
            <Entypo name="open-book" size={24} color={color} />
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
      <Drawer.Screen
        name="feedback"
        component={require("./(tabs)/feedback").default}
        options={{
          drawerLabel: "ĐÁNH GIÁ",
          drawerIcon: ({ color }) => (
            <Entypo name="star" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="setting"
        component={require("./(tabs)/setting").default}
        options={{
          drawerLabel: "CÀI ĐẶT",
          drawerIcon: ({ color }) => (
            <Entypo name="cog" size={24} color={color} />
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

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
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
      <RootLayout />
    </Provider>
  );
}
