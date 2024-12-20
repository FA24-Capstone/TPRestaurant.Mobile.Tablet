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
  useWindowDimensions,
} from "react-native";
import ListOrder from "../List/ListOrder";
import { Order } from "@/app/types/dishes_type";
import { useDispatch, useSelector } from "react-redux";
import store, { AppDispatch, RootState } from "@/redux/store";
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
import {
  cancelOrderDetailsBeforeCooking,
  getHistoryOrderId,
} from "@/api/ordersApi";
import { formatPriceVND } from "../Format/formatPrice";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import LoadingOverlay from "../LoadingOverlay";
import StatusLabel from "../StatusLabel";
import OrderInvoiceModal from "./Modal/OrderInvoiceModal";
import { showErrorMessage, showSuccessMessage } from "../FlashMessageHelpers";
import RenderHTML from "react-native-render-html";
import * as signalR from "@microsoft/signalr";
import { clearReservationData } from "@/redux/slices/reservationSlice";
import { clearDishes } from "@/redux/slices/dishesSlice";
import { clearOrders } from "@/redux/slices/ordersSlice";

const { width } = Dimensions.get("window");
const numColumns = 4;
const spacing = 8; // Margin on each side
const itemWidth = (width - 21 - (numColumns + 1) * spacing) / numColumns;

type RootStackParamList = {
  "list-dish": undefined; // Add this line
  index: undefined;
};

const HistoryOrderPanel: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // const { width } = useWindowDimensions(); // Lấy chiều rộng của màn hình để điều chỉnh RenderHtml

  const dispatch: AppDispatch = useDispatch();
  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );
  const { tableId, tableName } = useSelector((state: RootState) => state.auth);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [dishes, setDishes] = useState<OrderDish[]>([]);
  const [combos, setCombos] = useState<OrderDish[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDish[]>([]);
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null); // State for modal content
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

  const currentOrder = useSelector(
    (state: RootState) => state.orders.currentOrder
  );

  console.log("selectedOrders nè", JSON.stringify(selectedOrders, null, 2));
  // Log ra => {"orderId":"6e5b9440-9478-4559-b572-da37d6ca6e1b","orderDate":"0001-01-01T00:00:00","deliveryTime":null,"reservationDate":null,"mealTime":"2024-09-14T13:14:13.6363496","endTime":null,"totalAmount":700000,"statusId":3,"status":null,"customerId":null,"customerInfo":null,"paymentMethodId":2,"paymentMethod":null,"loyalPointsHistoryId":null,"loyalPointsHistory":null,"note":"","orderTypeId":3,"orderType":null,"numOfPeople":0,"deposit":null,"isPrivate":null}
  const orderId = currentOrder?.orderId;
  const noteOrder = currentOrder?.note;
  console.log("orderId nè", orderId);
  console.log("currentOrder history nè", JSON.stringify(currentOrder, null, 2));
  // console.log("modalContent nè", JSON.stringify(modalContent, null, 2));
  // console.log("dishes nè", JSON.stringify(dishes, null, 2));

  // console.log("reservationData nè", JSON.stringify(reservationData, null, 2));

  // Function to fetch order details
  const fetchOrderDetails = useCallback(async () => {
    if (!orderId && !reservationData?.result?.order?.orderId) {
      setLoading(false); // Đặt lại loading về false
      return;
    }

    try {
      setLoading(true);
      const response = await getHistoryOrderId(
        orderId || reservationData?.result?.order?.orderId || ""
      );
      // console.log("API responseGetOrder:", JSON.stringify(response, null, 2));
      // Check if the API call was successful
      if (response.isSuccess) {
        setOrderDetails(response.result.orderDishes);
      } else {
        const errorMessage =
          response.messages?.[0] || "Failed to fetch order details.";
        showErrorMessage(errorMessage);
      }
      // Set the order details in state
    } catch (error) {
      console.error("Error fetching order details:", error);
      showErrorMessage("An error occurred while fetching the order details.");
    } finally {
      setLoading(false);
    }
  }, [orderId, reservationData]);

  // Re-fetch order details when page is focused
  useFocusEffect(
    useCallback(() => {
      fetchOrderDetails();
    }, [fetchOrderDetails])
  );

  useEffect(() => {
    // Create connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/notifications`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);
  const handleBack = async () => {
    console.log("orderId nè", orderId);
    console.log("reservationData", reservationData);
    if (currentOrder != null) {
      console.log("orderId nè", currentOrder.orderId);

      const response = await getHistoryOrderId(currentOrder.orderId);
      console.log("response order", response);
      if (response.isSuccess) {
        setOrderDetails(response.result.orderDishes);

        if (response.result.order.statusId === 9) {
          showSuccessMessage(
            "Đã thanh toán thành công, chúng tôi sẽ đăng xuất sau 2s"
          );
          setTimeout(() => {
            handleLogout();
          }, 10000);
        }
      }
    } else if (reservationData != null) {
      const response = await getHistoryOrderId(
        reservationData.result.order.orderId
      );
      console.log("response order", response);
      if (response.isSuccess) {
        setOrderDetails(response.result.orderDishes);

        if (response.result.order.statusId === 9) {
          showSuccessMessage(
            "Đã thanh toán thành công, chúng tôi sẽ đăng xuất sau 2s"
          );
          setTimeout(() => {
            handleLogout();
          }, 10000);
        }
      }
    }
  };
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
            connection.on("LOAD_USER_ORDER", async () => {
              handleBack();
              console.log("Received LOAD_USER_ORDER event");
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

  // Giả sử bạn đã có orderDetails từ API trả về
  useEffect(() => {
    if (orderDetails.length > 0) {
      // Tách món ăn (Dish)
      const extractedDishes = orderDetails
        .filter((orderDish) => orderDish.dishSizeDetail && !orderDish.comboDish)
        .map((orderDish) => ({
          orderDetailsId: orderDish.orderDetailsId,
          dishSizeId: orderDish.dishSizeDetailId,
          name: orderDish.dishSizeDetail?.dish.name,
          quantity: orderDish.quantity,
          price: orderDish.dishSizeDetail?.price,
          status: {
            id: orderDish.status.id,
            name: orderDish.status.name,
            vietnameseName: orderDish.status.vietnameseName,
          }, // Ensure status is a Status object
          statusId: orderDish.statusId,
          image: orderDish.dishSizeDetail?.dish.image,
          sizeName: orderDish.dishSizeDetail?.dishSize.name,
          type: orderDish.dishSizeDetail?.dish.dishItemType,
          startDate: orderDish.orderTime,
          description: orderDish.dishSizeDetail?.dish.description || "",
          note: orderDish.note || "",
        }));

      // Tách combo
      const extractedCombos = orderDetails
        .filter((orderDish) => orderDish.comboDish)
        .map((orderDish) => ({
          orderDetailsId: orderDish.orderDetailsId,
          comboId: orderDish.comboDish?.comboId,
          comboName: orderDish.comboDish?.combo.name,
          quantity: orderDish.quantity,
          price: orderDish.comboDish?.combo.price,
          status: {
            id: orderDish.status.id,
            name: orderDish.status.name,
            vietnameseName: orderDish.status.vietnameseName,
          }, // Ensure status is a Status object
          statusId: orderDish.statusId,
          image: orderDish.comboDish?.combo.image,
          type: orderDish.comboDish?.combo.category,
          startDate: orderDish.orderTime,
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

  const toggleSelectOrder = (orderDetailsId: string) => {
    setSelectedOrders((prevSelected) => {
      if (prevSelected.includes(orderDetailsId)) {
        // Nếu đã chọn, bỏ chọn
        return prevSelected.filter((id) => id !== orderDetailsId);
      } else {
        // Nếu chưa chọn, thêm vào
        return [...prevSelected, orderDetailsId];
      }
    });
  };

  const openCancelModal = () => {
    if (selectedOrders.length === 0) {
      showErrorMessage("Vui lòng chọn ít nhất một món để hủy.");
      return;
    }
    setIsCancelModalVisible(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalVisible(false);
  };

  const handleCancelOrders = async () => {
    // Cập nhật trạng thái mới nhất trước khi hủy

    if (selectedOrders.length === 0) {
      showErrorMessage("Vui lòng chọn món cần hủy!");
      return;
    }
    await fetchOrderDetails();
    try {
      const response = await cancelOrderDetailsBeforeCooking(selectedOrders);
      if (response.isSuccess) {
        showSuccessMessage("Hủy món thành công!");
        setSelectedOrders([]); // Xóa danh sách đã chọn
        setIsCancelModalVisible(false); // Đóng modal
        fetchOrderDetails(); // Tải lại danh sách món
      } else {
        showErrorMessage(
          response.messages?.[0] || "Không thể hủy món. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Error cancelling orders:", error);
      showErrorMessage("Có lỗi xảy ra khi hủy món. Vui lòng thử lại.");
    }
  };

  // Function to show modal with content
  const showModal = (content: any) => {
    setModalContent(content);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  // Function to filter dishes based on the search query
  const filterDishesByQuery = (data: any[], query: string) => {
    if (!query) {
      // console.log("data nè", JSON.stringify(data, null, 2));

      return data;
    }
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
  // console.log("filteredDishes nè", JSON.stringify(filteredDishes, null, 2));

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

  const handleOrder = () => {
    // Navigate to the "history-order" screen
    navigation.navigate("list-dish");
  };
  const handleLogout = () => {
    dispatch(clearOrders());
    dispatch(clearReservationData());
    dispatch(clearDishes());
    console.log("Reservation data cleared:", store.getState().reservation.data);
    navigation.navigate("index");
  };
  return (
    <>
      {loading && (
        <View>
          <LoadingOverlay visible={loading} />
        </View>
      )}
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
        dataComboWithEmptySpaces.length > 0 ? (
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
                    return `${item.orderDetailsId}-${item.dishSizeId}-dish-${index}`; // Use `orderDetailsId` or fallback to index
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
                        isSelected={selectedOrders.includes(
                          item.orderDetailsId
                        )}
                        toggleSelect={toggleSelectOrder}
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
                        isSelected={selectedOrders.includes(
                          item.orderDetailsId
                        )}
                        toggleSelect={toggleSelectOrder}
                      />
                    );
                  }}
                  keyExtractor={(item, index) => {
                    if (item.empty) {
                      return `empty-${index}`; // Assign unique keys for empty items
                    }
                    return `${item.orderDetailsId}-${item.comboId}-combo-${index}`; // Use `orderDetailsId` or fallback to index
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
          <View className="flex-1 justify-center items-center  overflow-hidden">
            <Image
              source={require("../../assets/Icons/NoProduct.jpeg")}
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
                    <ScrollView style={{ maxHeight: 500 }}>
                      {/* Hiển thị tên món ăn hoặc combo */}
                      <Text className="font-bold text-2xl mb-2 text-gray-700">
                        {modalContent.name || modalContent.comboName}
                      </Text>

                      {/* Hiển thị mô tả món ăn hoặc combo
                      <Text className="mb-4 text-lg max-w-[500px]">
                        {modalContent.description || modalContent.description}
                      </Text> */}

                      {/* Hiển thị mô tả món ăn hoặc combo */}
                      <View className="max-w-[600px]">
                        <RenderHTML
                          contentWidth={100}
                          source={{ html: modalContent.description || "" }}
                          tagsStyles={{
                            p: { fontSize: 16, color: "#333" },
                          }}
                        />
                      </View>

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

                      <View className="flex-row item">
                        <Text className="font-semibold mr-2 text-gray-700 text-lg mb-4">
                          Trạng thái:
                        </Text>
                        <StatusLabel statusId={modalContent?.statusId} />
                      </View>

                      {modalContent.comboDishes && (
                        <View className="w-full">
                          <Text className="font-semibold text-lg text-gray-700 h-fit my-2">
                            Món đã chọn:
                          </Text>
                          <View className="flex-row flex-wrap  gap-2">
                            {modalContent.comboDishes.map((dish) => (
                              <View
                                key={dish.dishId}
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
                    </ScrollView>
                    {/* Nút hành động */}
                    <View className="flex-row justify-end mt-6 items-center">
                      <TouchableOpacity
                        className="mt-4 bg-gray-500 p-2 rounded-lg w-[100px] mr-6"
                        onPress={hideModal}
                      >
                        <Text className="text-white text-center font-semibold text-lg uppercase">
                          Đóng
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

        <Modal
          transparent={true}
          visible={isCancelModalVisible}
          animationType="fade"
        >
          <View className="flex-1 justify-center items-center bg-[#00000099]">
            <View className="bg-white rounded-lg p-6  w-2/3">
              <Text className="text-2xl font-bold mb-4 text-center text-gray-700">
                Xác nhận hủy món
              </Text>
              <Text className="text-center text-lg mb-6 text-gray-500">
                Bạn có chắc chắn muốn hủy {selectedOrders.length} món đã chọn
                không?
              </Text>
              <View className="flex-row justify-around">
                <TouchableOpacity
                  className="mt-4 bg-gray-500 p-2 rounded-lg w-[35%] mr-6"
                  onPress={closeCancelModal}
                >
                  <Text className="text-white text-center font-semibold text-lg uppercase">
                    Hủy
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCancelOrders}
                  className="mt-4 bg-[#C01D2E] p-2 rounded-lg w-[35%] mr-6"
                >
                  <Text className="text-white font-bold text-lg uppercase text-center">
                    Xác nhận
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Other components and logic */}
        {(dataDishWithEmptySpaces.length > 0 ||
          dataComboWithEmptySpaces.length > 0) && (
          <View className="flex-row justify-center items-center">
            {selectedOrders.length > 0 && (
              <TouchableOpacity
                onPress={openCancelModal}
                className="py-2 px-4 bg-[#C01D2E] w-1/3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold text-lg uppercase">
                  Hủy món đã chọn
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="py-2 px-4 bg-[#EDAA16] w-1/3 rounded-lg m-6"
              onPress={() => setInvoiceVisible(true)} // Show modal when button is pressed
            >
              <Text className="text-white text-center font-semibold text-lg uppercase">
                Hoá đơn thanh toán
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <OrderInvoiceModal
          visible={invoiceVisible}
          onClose={() => setInvoiceVisible(false)}
          onOpen={() => setInvoiceVisible(true)}
          customerName={`${
            reservationData?.result?.order?.account?.firstName ??
            "Không có thông tin"
          } ${reservationData?.result?.order?.account?.lastName ?? ""}`} // Replace with actual customer name
          customerPhone={
            reservationData?.result?.order?.account?.phoneNumber || ""
          } // Replace with actual customer phone
          mealTime={
            reservationData?.result?.order?.mealTime ||
            currentOrder?.mealTime ||
            ""
          }
          numOfPeople={reservationData?.result?.order?.numOfPeople || 0}
          tableName={tableName || ""} // Replace with actual table name
          orderId={orderId || reservationData?.result?.order?.orderId || ""}
          orderDetails={orderDetails}
          currentOrder={currentOrder}
        />
      </View>
    </>
  );
};

export default HistoryOrderPanel;
