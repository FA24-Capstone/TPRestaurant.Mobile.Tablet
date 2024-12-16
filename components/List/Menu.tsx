import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import SearchBar from "../SearchBar";
import CategoryTabs from "../Tabs/CategoryTabs";
import DishCard from "../Cards/DishCard";
import MarqueeText from "../MarqueeText";
import { Dish } from "@/app/types/dishes_type";
import { fetchDishes } from "@/api/dishesApi";
import { Combo } from "@/app/types/combo_type";
import { fetchCombos } from "@/api/comboApi";
import ListCombo from "./ListCombo";
import ListDishes from "./ListDishes";
import LoadingOverlay from "../LoadingOverlay";
import * as signalR from "@microsoft/signalr";
import { showSuccessMessage } from "../FlashMessageHelpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface MenuProps {
  isPanelOpen: boolean;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const Menu: React.FC<MenuProps> = ({ isPanelOpen }) => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(9);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // **New State for Search Query**
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  // console.log("dishesList", dishes);

  const categories = [
    "Tất cả",
    "Khai vị",
    "Súp",
    "Lẩu",
    "Nướng",
    "Tráng miệng",
    "Đồ uống",
    "Món ăn kèm",
    "Nước chấm",
    "Khác", // Thêm các loại khác nếu cần
  ];
  const DishItemTypeTranslations = {
    APPETIZER: "Khai vị",
    SOUP: "Súp",
    HOTPOT: "Lẩu",
    BBQ: "Nướng",
    HOTPOT_BROTH: "Nước lẩu",
    HOTPOT_MEAT: "Thịt cho lẩu",
    HOTPOT_SEAFOOD: "Hải sản cho lẩu",
    HOTPOT_VEGGIE: "Rau củ cho lẩu",
    BBQ_MEAT: "Thịt cho BBQ",
    BBQ_SEAFOOD: "Hải sản cho BBQ",
    HOTPOT_TOPPING: "Topping cho lẩu",
    BBQ_TOPPING: "Topping cho BBQ",
    SIDEDISH: "Món ăn kèm",
    DRINK: "Đồ uống",
    DESSERT: "Tráng miệng",
    SAUCE: "Nước chấm",
  };

  const loadMenuItems = useCallback(async () => {
    console.log("====================================");
    console.log("loadMenuItems");
    console.log("====================================");
    try {
      setLoading(true);
      setError(null); // Reset error before fetching

      // Fetch combos first
      let fetchedCombos: Combo[] = [];
      try {
        fetchedCombos = await fetchCombos(1, pageSize);
        setCombos(fetchedCombos);
        console.log("Fetched combos:", fetchedCombos);
      } catch (error) {
        console.error("Error fetching combos:", error);
        setCombos([]);
      }

      // Fetch dishes
      let fetchedDishes: Dish[] = [];
      try {
        fetchedDishes = await fetchDishes(1, pageSize);
        setDishes(fetchedDishes);
        console.log("Fetched dishes:", fetchedDishes);
      } catch (error) {
        console.error("Error fetching dishes:", error);
        setDishes([]);
      }

      if (fetchedDishes.length < pageSize && fetchedCombos.length < pageSize) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error("Error loading menu items:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Failed to load menu items: ${err.response.data.message}`);
      } else {
        setError("Failed to load menu items");
      }
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={loadMenuItems} style={{ marginTop: 20 }}>
          <Text style={{ color: "blue" }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    // Create connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/notifications`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 3000; // 3 seconds

    const startConnection = async () => {
      if (connection) {
        // Start the connection
        connection
          .start()
          .then(() => {
            console.log("Connected to SignalR");
            showSuccessMessage("Connected to SignalR");
            // Subscribe to SignalR event
            console.log("connection", connection);
            connection.on("LOAD_NOTIFICATION", () => {
              console.log("Received LOAD_NOTIFICATION event");
              loadMenuItems();
            });
          })
          .catch((error) => {
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              setTimeout(startConnection, RETRY_DELAY);
            } else {
              console.log("Max retries reached. Could not connect to SignalR.");
            }
          });
      }
    };
    startConnection();
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);

  useEffect(() => {
    loadMenuItems();
  }, [pageSize]);

  if (loading) {
    // Use LoadingOverlay for initial loading
    return (
      <View style={{ flex: 1 }}>
        <LoadingOverlay visible={loading} />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }
  const shouldShowDishes = (category: string) => {
    if (category === "Tất cả") {
      return dishes.length > 0 || combos.length > 0;
    }

    const hasDishes = dishes.some(
      (dish) => DishItemTypeTranslations[dish.dishItemType.name] === category
    );
    const hasCombos = combos.some(
      (combo) => DishItemTypeTranslations[combo.category.name] === category
    );

    return hasDishes || hasCombos;
  };

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      {/* <MarqueeText /> */}

      <View className="p-4 mx-2">
        <View className="flex-row items-center justify-between mx-2 mb-4 mt-2">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={loadMenuItems}
              disabled={loading}
              className="bg-[#A1011A] p-2 rounded-full mr-4  w-fit flex-row items-center justify-center"
            >
              <MaterialCommunityIcons name="reload" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-[25px] font-bold uppercase pb-2 border-b-2 text-[#970C1A] border-[#970C1A]">
              Thực đơn hôm nay
            </Text>
          </View>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </View>
        {/* <TouchableOpacity
          onPress={loadMenuItems}
          disabled={loading}
          className={`my-2 ${loading ? "opacity-50" : ""}`}
        >
          <Text>Tải Lại</Text>
        </TouchableOpacity> */}
        <View className="flex-row justify-center mb-2">
          <CategoryTabs
            categories={categories.filter(shouldShowDishes)}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>
      </View>
      <ScrollView className="flex-1 bg-[#F9F9F9]">
        {/* {shouldShowDishes(selectedCategory) && ( */}
        <>
          <ListDishes
            isPanelOpen={isPanelOpen}
            selectedCategory={selectedCategory}
            DishItemTypeTranslations={DishItemTypeTranslations}
            searchQuery={searchQuery}
          />
          <ListCombo
            isPanelOpen={isPanelOpen}
            selectedCategory={selectedCategory}
            DishItemTypeTranslations={DishItemTypeTranslations}
            searchQuery={searchQuery}
          />
        </>
        {/* )} */}
      </ScrollView>
    </View>
  );
};

export default Menu;
