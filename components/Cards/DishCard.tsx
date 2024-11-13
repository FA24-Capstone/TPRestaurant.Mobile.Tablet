import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { addOrUpdateDish } from "../../redux/slices/dishesSlice";
import { Dish, DishSizeDetail } from "@/app/types/dishes_type";
import { formatPriceVND } from "../Format/formatPrice";
import { showErrorMessage } from "../FlashMessageHelpers";
import RenderHTML from "react-native-render-html";
import LimitedRenderHTML from "../LimitedRenderHTML";

interface DishCardProps {
  id: string;
  image: number | string;
  name: string;
  rating: number;
  ratingCount: number;
  type: string;
  price: number;
  description?: string;
  dishSizeDetails?: DishSizeDetail[];
  isAvailable?: boolean;
  isDeleted?: boolean;
}

const DishCard: React.FC<DishCardProps> = ({
  id,
  image,
  name,
  rating,
  ratingCount,
  type,
  price,
  description,
  dishSizeDetails,
  isAvailable,
  isDeleted,
}) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

  const handleAddDish = () => {
    if (!isAvailable) {
      showErrorMessage(
        "Món ăn này hiện không khả dụng. Vui lòng chọn món khác."
      );
    } else if (dishSizeDetails && dishSizeDetails.length === 0) {
      showErrorMessage("Món ăn này chưa hoàn thiện. Vui lòng chọn món khác!");
    } else {
      if (dishSizeDetails && dishSizeDetails.length > 0) {
        // Show modal if there are dishSizeDetails
        setModalVisible(true);
      } else {
        // Create the Dish object
        const dish: Dish = {
          id,
          image,
          name,
          rating,
          ratingCount,
          dishItemTypeId: 1, // Replace with actual type ID if available
          price,
          description,
          dishSizeDetails: [],
          isDeleted: isDeleted ?? false,
          dishItemType: { id: 1, name: type, vietnameseName: null }, // Replace with actual type if available
          isAvailable: isAvailable ?? true, // Add isAvailable property
        };

        // Add dish to cart if no dishSizeDetails
        dispatch(
          addOrUpdateDish({
            dish, // Pass the entire Dish object
            selectedSizeId: "", // No size selected
          })
        );
      }
    }
  };

  const handleAddToOrder = () => {
    if (selectedSizeId) {
      const selectedSize = dishSizeDetails?.find(
        (detail) => detail.dishSizeDetailId === selectedSizeId
      );

      if (selectedSize) {
        // Create the Dish object with the selected size detail
        const dish: Dish = {
          id,
          image,
          name,
          rating,
          ratingCount,
          dishItemTypeId: 1, // Replace with actual type ID if available
          price: selectedSize.price, // Use the price of the selected size
          description,
          isDeleted: isDeleted ?? false,
          isAvailable: isAvailable ?? true, // Add isAvailable property
          dishSizeDetails: [selectedSize], // Only include the selected size detail
          dishItemType: { id: 1, name: type, vietnameseName: null }, // Replace with actual type if available
        };

        dispatch(
          addOrUpdateDish({
            dish, // Pass the entire Dish object
            selectedSizeId: selectedSize.dishSizeDetailId, // Pass the selected size ID
          })
        );
        setModalVisible(false);
      }
    } else {
      alert("Vui lòng chọn kích cỡ món ăn trước khi thêm vào order.");
    }
  };

  const renderDishSizeDetail = ({ item }: { item: DishSizeDetail }) => {
    const isSelected = item.dishSizeDetailId === selectedSizeId;
    const isOutOfStock = item.quantityLeft === 0 || item.isAvailable === false;

    // Translation function
    const translateSize = (size: string) => {
      switch (size) {
        case "SMALL":
          return "Nhỏ";
        case "MEDIUM":
          return "Vừa";
        case "LARGE":
          return "Lớn";
        default:
          return size; // If none matches, return the original value
      }
    };

    const handleDisabledItemClick = () => {
      showErrorMessage("Món này đã hết hàng và không thể chọn.");
    };

    // console.log("dishSizeDetailsDish", dishSizeDetails);

    return (
      <TouchableOpacity
        onPress={() => {
          if (isOutOfStock) {
            handleDisabledItemClick();
          } else {
            setSelectedSizeId(item?.dishSizeDetailId);
          }
        }}
        className={`mb-2 p-4 rounded-md mr-4 mt-4 ${
          isSelected ? "bg-[#F2D2D5] border-2 border-[#F2D2D5]" : "bg-gray-200"
        } ${isOutOfStock ? "bg-gray-900 opacity-50" : ""}`} // Gray out if out of stock
        disabled={isOutOfStock} // Disable press if out of stock
      >
        <Text
          className={`font-semibold text-center text-lg uppercase ${
            isSelected ? "text-[#C01D2E]" : "text-gray-600"
          } ${isOutOfStock ? "text-white" : ""}`}
        >
          {translateSize(item?.dishSize?.name || "")}
        </Text>
        <View className="flex-row items-center justify-center mt-2">
          <Text
            className={`font-semibold text-center text-lg ${
              isSelected ? "text-[#C01D2E]" : "text-gray-600"
            } ${isOutOfStock ? "text-white" : ""}`}
          >
            {formatPriceVND(item?.price ?? 0)}
          </Text>
          {/* {item?.discount > 0 && (
            <Text
              className={`ml-4 ${
                isSelected ? "text-[#C01D2E]" : "text-gray-600"
              } ${isOutOfStock ? "text-white" : ""}`}
            >
              (- {item?.discount}%)
            </Text>
          )} */}
        </View>
        {item.quantityLeft ? (
          <Text
            className={`text-center font-semibold  mt-2 ${
              item.quantityLeft <= 5 ? "text-red-500" : "text-gray-600"
            } ${isOutOfStock ? "text-white" : ""} `}
          >
            (Còn {item.quantityLeft ?? 0} món)
          </Text>
        ) : (
          <Text
            className={`text-center font-semibold  mt-2 ${"text-red-500"} ${
              isOutOfStock ? "text-white" : ""
            } `}
          >
            (Hết hàng)
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity
      onPress={handleAddDish}
      className="pt-24 m-2 overflow-hidden w-full relative"
    >
      <View
        style={{
          width: 140,
          height: 140,
          borderRadius: 100,
          overflow: "hidden", // Cắt phần ảnh thừa để hiển thị hình tròn
          borderWidth: 2,
          borderColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="absolute top-0 left-[50px] right-0 mx-auto z-10"
      >
        <Image
          source={typeof image === "string" ? { uri: image } : image}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover" // Đảm bảo ảnh lấp đầy khung tròn
        />
      </View>

      <View className="pt-14 rounded-[16px] z-0 shadow-xl bg-[#FFF1E1]">
        <Text
          className="font-bold text-[20px] px-2 text-center"
          numberOfLines={1} // Số dòng tối đa
          ellipsizeMode="tail"
        >
          {name}
        </Text>
        <Text className="text-gray-500 text-center mb-2">{type}</Text>
        <View className="flex-row items-center mx-auto mb-2">
          <Icon name="star" size={20} color="#FFD700" />
          <Text className=" text-gray-500 ml-1 font-semibold">{rating}</Text>
          <Text className="text-gray-500 ml-1 font-semibold">
            ({ratingCount})
          </Text>
        </View>
        <Text className="font-bold text-lg text-center text-[#C01D2E]">
          {formatPriceVND(price)}
        </Text>
        <TouchableOpacity
          className={` border-2 p-2 rounded-[20px]  w-[80%] mx-auto mb-4 mt-2 ${
            isAvailable && dishSizeDetails && dishSizeDetails.length > 0
              ? "border-[#E45834]"
              : "border-gray-400"
          }`}
          onPress={handleAddDish}
          disabled={!isAvailable}
        >
          <Text
            className={`text-[#E45834] text-center font-bold text-lg ${
              isAvailable && dishSizeDetails && dishSizeDetails.length > 0
                ? "text-[#E45834]"
                : "text-gray-500"
            }`}
          >
            Chọn món này
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal để chọn dish size */}
      {dishSizeDetails && dishSizeDetails.length > 0 && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-[#22222391] bg-opacity-50">
            <View className="bg-white rounded-lg p-4 min-w-[70%]">
              <View className="flex-row ">
                <Image
                  source={typeof image === "string" ? { uri: image } : image}
                  className="w-[400px] h-full rounded-lg mb-4"
                  resizeMode="cover"
                />
                <View className=" ml-6">
                  <Text className="font-bold text-2xl mb-2 text-gray-700 w-full">
                    {name}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-gray-600 text-lg mr-4 mb-2">
                      {type} -
                    </Text>
                    <View className="flex-row items-center mb-2">
                      <Icon name="star" size={20} color="#FFD700" />
                      <Text className=" text-gray-500 ml-1 text-base font-semibold">
                        {rating}
                      </Text>
                      <Text className="text-gray-500 text-base ml-1 font-semibold">
                        ({ratingCount})
                      </Text>
                    </View>
                  </View>

                  <View className="max-w-[600px]">
                    <LimitedRenderHTML
                      htmlContent={description || "No description available"}
                    />
                  </View>
                  {/* <Text className="mb-4 text-lg max-w-[500px]">
                    {description}
                  </Text> */}
                  <Text className="font-semibold text-lg">
                    Các lựa chọn kích cỡ:
                  </Text>
                  <FlatList
                    data={dishSizeDetails?.sort(
                      (a, b) => a.dishSizeId - b.dishSizeId
                    )}
                    renderItem={renderDishSizeDetail}
                    keyExtractor={(item) => item.dishSizeDetailId} // Chuyển id thành chuỗi nếu cần thiết
                    horizontal={true} // Thiết lập FlatList hiển thị theo chiều ngang
                    showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang nếu không cần thiết
                  />
                  <View className=" flex-row justify-end">
                    <TouchableOpacity
                      className="mt-4 bg-gray-500 p-2 rounded-lg w-[100px] mr-6"
                      onPress={() => setModalVisible(false)}
                    >
                      <Text className="text-white text-center font-semibold text-lg uppercase">
                        Huỷ
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="mt-4 bg-[#C01D2E] w-[200px] p-2 rounded-lg"
                      onPress={handleAddToOrder}
                    >
                      <Text className="text-white text-center font-semibold text-lg uppercase">
                        Thêm vào order
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </TouchableOpacity>
  );
};

export default DishCard;
