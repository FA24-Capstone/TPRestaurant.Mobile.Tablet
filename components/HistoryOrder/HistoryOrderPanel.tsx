import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import ListOrder from "../List/ListOrder";
import { Order } from "@/app/types/dishes_type";
import { fetchTableSessionById } from "@/api/tableSection";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import DishCardHistory from "./CardHistory/DishCardHistory";
import ComboCardHistory from "./CardHistory/ComboCardHistory";
import {
  GetTableSessionResponse,
  UncheckedPrelistOrderDetail,
} from "@/app/types/tableSession_type";
import SearchBar from "../SearchBar";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment-timezone";
import {
  Combo,
  ComboDish,
  DishSizeDetail,
  OrderDish,
} from "@/app/types/order_type";
import { getHistoryOrderId } from "@/api/ordersApi";
import { formatPriceVND } from "../Format/formatPrice";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

const { width } = Dimensions.get("window");
const numColumns = 4;
const spacing = 8; // Margin on each side
const itemWidth = (width - 21 - (numColumns + 1) * spacing) / numColumns;

type RootStackParamList = {
  "list-dish": undefined; // Add this line
};

const HistoryOrderPanel: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const dispatch: AppDispatch = useDispatch();
  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );
  const [dishes, setDishes] = useState<OrderDish[]>([]);
  const [combos, setCombos] = useState<OrderDish[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDish[]>([]);
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null); // State for modal content
  const [searchQuery, setSearchQuery] = useState<string>("");

  const currentOrder = useSelector(
    (state: RootState) => state.orders.currentOrder
  );

  // console.log("orders nè", JSON.stringify(orderDetails, null, 2));
  // Log ra => {"orderId":"6e5b9440-9478-4559-b572-da37d6ca6e1b","orderDate":"0001-01-01T00:00:00","deliveryTime":null,"reservationDate":null,"mealTime":"2024-09-14T13:14:13.6363496","endTime":null,"totalAmount":700000,"statusId":3,"status":null,"customerId":null,"customerInfo":null,"paymentMethodId":2,"paymentMethod":null,"loyalPointsHistoryId":null,"loyalPointsHistory":null,"note":"","orderTypeId":3,"orderType":null,"numOfPeople":0,"deposit":null,"isPrivate":null}
  const orderId = currentOrder?.orderId;
  const noteOrder = currentOrder?.note;

  // console.log("modalContent nè", JSON.stringify(modalContent, null, 2));
  // console.log("dishes nè", JSON.stringify(dishes, null, 2));

  // console.log("reservationData nè", JSON.stringify(reservationData, null, 2));

  // Function to fetch order details
  const fetchOrderDetails = useCallback(async () => {
    if (!orderId && !reservationData?.result.order.orderId) return;

    try {
      const response = await getHistoryOrderId(
        orderId || reservationData?.result?.order?.orderId || ""
      );
      // console.log("API responseGetOrder:", JSON.stringify(response, null, 2));

      // Set the order details in state
      setOrderDetails(response.result.orderDishes);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  }, [orderId]);

  // Re-fetch order details when page is focused
  useFocusEffect(
    useCallback(() => {
      fetchOrderDetails();
    }, [fetchOrderDetails])
  );

  // Giả sử bạn đã có orderDetails từ API trả về
  useEffect(() => {
    if (orderDetails.length > 0) {
      // Tách món ăn (Dish)
      const extractedDishes = orderDetails
        .filter((orderDish) => orderDish.dishSizeDetail && !orderDish.comboDish)
        .map((orderDish) => ({
          orderDetailsId: orderDish.orderDetailsId,
          name: orderDish.dishSizeDetail?.dish.name,
          quantity: orderDish.quantity, // Nếu không có quantity trong orderDish, mặc định là 1
          price: orderDish.dishSizeDetail?.price,
          status: "Đã phục vụ",
          image: orderDish.dishSizeDetail?.dish.image,
          sizeName: orderDish.dishSizeDetail?.dishSize.name,
          type: orderDish.dishSizeDetail?.dish.dishItemType, // loại món
          startDate: orderDish.orderTime, // Giả sử startDate có ở đây
          description: orderDish.dishSizeDetail?.dish.description || "",
          note: orderDish.note || "",
        }));

      // Tách combo
      const extractedCombos = orderDetails
        .filter((orderDish) => orderDish.comboDish)
        .map((orderDish) => ({
          orderDetailsId: orderDish.orderDetailsId,
          comboName: orderDish.comboDish?.combo.name,
          quantity: orderDish.quantity, // Mặc định là 1 nếu không có quantity trong comboDish
          price: orderDish.comboDish?.combo.price,
          image: orderDish.comboDish?.combo.image,
          type: orderDish.comboDish?.combo.category, // loại món
          startDate: orderDish.orderTime,
          status: "Đã phục vụ",
          description: orderDish.comboDish?.combo.description || "",
          comboDishes: orderDish.comboDish?.dishCombos.map((dishCombo) => ({
            dishId: dishCombo.dishComboId,
            name: dishCombo.dishSizeDetail.dish.name,
            size: dishCombo.dishSizeDetail.dishSize.name,
            price: dishCombo.dishSizeDetail.price,
            image: dishCombo.dishSizeDetail.dish.image,
          })),
          note: orderDish.note || "",
        }));

      // Sort dishes and combos by orderTime (earliest first)
      const sortedDishes = extractedDishes.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      const sortedCombos = extractedCombos.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      setDishes(
        sortedDishes.map((dish) => ({
          ...dish,
          orderTime: dish.startDate, // Ensure orderTime is included
        }))
      );
      setCombos(
        sortedCombos.map((combo) => ({
          ...combo,
          orderTime: combo.startDate, // Ensure orderTime is included
        }))
      );
    }
  }, [orderDetails]);

  // Function to show modal with content
  const showModal = (content: any) => {
    setModalContent(content);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  // Function to filter dishes based on the search query
  const filterDishesByQuery = (data: any[], query: string) => {
    if (!query) return data;
    return data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Function to filter combos based on the search query
  const filterCombosByQuery = (data: any[], query: string) => {
    if (!query) return data;
    return data.filter((item) =>
      item.comboName.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredDishes = filterDishesByQuery(dishes, searchQuery);
  const filteredCombos = filterCombosByQuery(combos, searchQuery);

  // Function to add empty spaces to maintain layout
  const fillEmptySpaces = (data: any[]) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    const numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    if (numberOfElementsLastRow !== 0) {
      const emptySpaces = numColumns - numberOfElementsLastRow;
      for (let i = 0; i < emptySpaces; i++) {
        data.push({ empty: true });
      }
    }
    return data;
  };

  const dataDishWithEmptySpaces = fillEmptySpaces([...filteredDishes]);
  const dataComboWithEmptySpaces = fillEmptySpaces([...filteredCombos]);
  console.log(
    "dataComboWithEmptySpacesNe",
    JSON.stringify(dataComboWithEmptySpaces, null, 2)
  );

  const handleOrder = () => {
    // Navigate to the "history-order" screen
    navigation.navigate("list-dish");
  };

  return (
    <View className="flex-1 py-4 px-4 bg-[#f9f9f9]">
      <View className="flex-row items-center justify-between mx-2 mb-4 mt-2">
        <Text className="text-[25px] font-bold uppercase pb-2 border-b-2 text-[#970C1A] border-[#970C1A]">
          Lịch sử đặt món của bạn
        </Text>
        <View className="flex-row w-1/2 justify-evenly items-center">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <TouchableOpacity
            className="  py-2 px-4  bg-[#C01D2E] rounded-lg mr-6"
            onPress={handleOrder}
          >
            <Text className="text-white  text-center font-semibold text-lg uppercase">
              Đặt thêm món
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {dataDishWithEmptySpaces.length > 0 ||
      dataDishWithEmptySpaces.length > 0 ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          {/* List of Dishes */}
          {dataDishWithEmptySpaces.length > 0 && (
            <View className="my-2">
              <Text className="text-xl font-bold ml-8 text-[#970C1A] uppercase">
                Món lẻ:
              </Text>
              <FlatList
                keyExtractor={(item, index) => {
                  if (item.empty) {
                    return `empty-${index}`; // Assign unique keys for empty items
                  }
                  return `${item.orderDetailsId}-dish-${index}`; // Use `orderDetailsId` or fallback to index
                }}
                data={dataDishWithEmptySpaces}
                renderItem={({ item }) => {
                  // Nếu item là rỗng, không render gì
                  if (item.empty) {
                    return (
                      <View
                        key={item.id}
                        style={{ width: itemWidth, marginBottom: spacing }}
                      />
                    );
                  }

                  // Nếu item có dữ liệu, render bình thường
                  return (
                    <DishCardHistory
                      dish={item}
                      itemWidth={itemWidth}
                      showModal={showModal}
                      noteOrder={noteOrder || ""} // Truyền noteOrder vào DishCardHistory
                    />
                  );
                }}
                // keyExtractor={(item) =>
                //   item.dishSizeDetailId || item.orderDetailId
                // }
                numColumns={numColumns}
                scrollEnabled={false}
                columnWrapperStyle={{ marginHorizontal: spacing }}
                contentContainerStyle={{ paddingHorizontal: spacing }}
              />
            </View>
          )}

          {/* List of Combos */}
          {dataComboWithEmptySpaces.length > 0 && (
            <View className="my-2">
              <Text className="text-xl font-bold ml-8 text-[#970C1A] uppercase">
                Món Combo:
              </Text>
              <FlatList
                data={dataComboWithEmptySpaces}
                renderItem={({ item }) => {
                  // Nếu item là rỗng, không render gì
                  if (item.empty) {
                    return (
                      <View
                        key={item.id}
                        style={{ width: itemWidth, marginBottom: spacing }}
                      />
                    );
                  }

                  // Nếu item có dữ liệu, render bình thường
                  return (
                    <ComboCardHistory
                      combo={item}
                      itemWidth={itemWidth}
                      showModal={showModal}
                      comboDetails={item?.comboDetails}
                      noteOrder={noteOrder || ""} // Truyền noteOrder vào DishCardHistory
                    />
                  );
                }}
                keyExtractor={(item, index) => {
                  if (item.empty) {
                    return `empty-${index}`; // Assign unique keys for empty items
                  }
                  return `${item.orderDetailsId}-combo-${index}`; // Use `orderDetailsId` or fallback to index
                }}
                numColumns={numColumns}
                scrollEnabled={false}
                columnWrapperStyle={{ marginHorizontal: spacing }}
                contentContainerStyle={{
                  paddingHorizontal: spacing,
                  marginTop: 16,
                }}
              />
            </View>
          )}
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../../assets/Icons/NoProduct.png")}
            className="w-40 h-40"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-medium text-xl text-center my-6 w-3/5 uppercase">
            HIỆN TẠI CHƯA CÓ MÓN NÀO ĐƯỢC CHỌN
          </Text>
        </View>
      )}

      {/* Modal to display details */}
      <Modal transparent={true} visible={visible} onDismiss={hideModal}>
        <View className="flex-1 justify-center  items-center bg-[#22222391] bg-opacity-50">
          <View className="bg-white w-min-[70%] rounded-lg p-4 ">
            {modalContent && (
              <View className="flex-row ">
                {/* Hiển thị hình ảnh */}
                <Image
                  source={{
                    uri: modalContent.image || modalContent.image,
                  }}
                  className="w-[500px] h-[400px] rounded-lg mb-4"
                  resizeMode="cover"
                />
                <View className="ml-6">
                  {/* Hiển thị tên món ăn hoặc combo */}
                  <Text className="font-bold text-2xl mb-2 text-gray-700">
                    {modalContent.name || modalContent.comboName}
                  </Text>

                  {/* Hiển thị mô tả món ăn hoặc combo */}
                  <Text className="mb-4 text-lg">
                    {modalContent.description || modalContent.description}
                  </Text>

                  {/* Hiển thị giá của món ăn hoặc combo */}
                  <Text className="font-bold text-lg text-[#C01D2E] mb-4">
                    Giá: {formatPriceVND(modalContent.price)}
                  </Text>

                  {/* Hiển thị số lượng */}
                  <View className="flex-row gap-2 ">
                    <Text className="font-semibold text-gray-700 text-lg mb-4">
                      Số lượng đã đặt:
                    </Text>
                    <Text className="font-bold text-[#EDAA16] text-xl mb-4">
                      + {modalContent.quantity} món
                    </Text>
                  </View>

                  <View className="mt-2 flex-row flex-ư">
                    <Text className="text-gray-700 font-semibold text-lg">
                      Thời gian đặt:
                    </Text>
                    <View className="ml-4">
                      <Text className="text-gray-500 text-lg">
                        •{" "}
                        {moment
                          .utc(modalContent.startDate)
                          .format("HH:mm, DD/MM/YYYY")}
                      </Text>
                    </View>
                  </View>

                  {modalContent.comboDishes && (
                    <View className="w-full">
                      <Text className="font-semibold text-lg text-gray-700 h-fit my-2">
                        Món đã chọn:
                      </Text>
                      <View className="flex-row flex-wrap  gap-2">
                        {modalContent.comboDishes.map((dish) => (
                          <View
                            key={dish.dishComboId + dish.dishSizeDetailId}
                            className="bg-white rounded-md p-2 shadow-md"
                          >
                            <Image
                              source={{ uri: dish.image }}
                              className="h-20 w-20 rounded-md mx-auto"
                            />
                            <Text className="text-center text-sm font-semibold">
                              {dish.name}
                            </Text>
                            <Text className="text-center text-sm font-semibold text-red-600">
                              {formatPriceVND(dish.price)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Nút hành động */}
                  <View className="flex-row justify-end mt-6 items-center">
                    <TouchableOpacity
                      className="mt-4 bg-gray-500 p-2 rounded-lg w-[100px] mr-6"
                      onPress={hideModal}
                    >
                      <Text className="text-white text-center font-semibold text-lg uppercase">
                        Huỷ
                      </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity className="mt-4 bg-[#C01D2E] p-2 rounded-lg w-[200px] mr-6"
                    onPress={() => handleReorder(modalContent)} >
                      <Text className="text-white text-center font-semibold text-lg uppercase">
                        Đặt lại
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HistoryOrderPanel;
