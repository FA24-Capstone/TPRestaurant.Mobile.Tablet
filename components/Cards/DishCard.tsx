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
import { DishSizeDetail } from "@/app/types/dishes_type";
import { formatPriceVND } from "../Format/formatPrice";

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
}) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

  const handleAddDish = () => {
    // console.log("dishSizeDetailsNe", dishSizeDetails);

    if (dishSizeDetails && dishSizeDetails.length > 0) {
      // Hiển thị modal nếu có dishSizeDetails
      setModalVisible(true);
    } else {
      // Thêm món vào giỏ nếu không có dishSizeDetails
      dispatch(
        addOrUpdateDish({
          id: id, // Convert id to a number if necessary
          image,
          name,
          rating,
          ratingCount,
          type,
          price,
          quantity: 1,
        })
      );
    }
  };

  const handleAddToOrder = () => {
    if (selectedSizeId) {
      const selectedSize = dishSizeDetails?.find(
        (detail) => detail.dishSizeDetailId === selectedSizeId
      );

      if (selectedSize) {
        // Chắc chắn rằng id được chuyển đổi một cách chính xác
        // Chỉ dispatch nếu numericId là một số hợp lệ
        dispatch(
          addOrUpdateDish({
            id: id,
            image,
            name,
            rating,
            ratingCount,
            type,
            price: selectedSize.price, // Sử dụng giá của size được chọn
            size: selectedSize.dishSize.name, // Lưu tên size
            sizePrice: selectedSize.price, // Lưu giá của size được chọn
            quantity: 1,
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

    return (
      <TouchableOpacity
        onPress={() => setSelectedSizeId(item.dishSizeDetailId)}
        className={`mb-2 p-4 rounded-md mr-4 mt-4 ${
          isSelected ? "bg-[#F2D2D5] border-2 border-[#F2D2D5]" : "bg-gray-200"
        }`}
      >
        <Text
          className={`font-semibold text-center text-lg ${
            isSelected ? "text-[#C01D2E]" : "text-gray-600"
          }`}
        >
          {item.dishSize.name}
        </Text>
        <View className="flex-row items-center justify-center mt-2">
          <Text
            className={`font-semibold text-center text-lg ${
              isSelected ? "text-[#C01D2E]" : "text-gray-600"
            }`}
          >
            {formatPriceVND(item.price)}
          </Text>
          {item.discount > 0 && (
            <Text
              className={`ml-4 ${isSelected ? "text-white" : "text-gray-600"}`}
            >
              (- {item.discount}%)
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="pt-24 m-2 overflow-hidden relative">
      <Image
        source={typeof image === "string" ? { uri: image } : image} // Handle both local and URL images
        className="absolute top-2 z-10 left-[20%] transform -translate-x-1/2 h-[130px] w-[130px] rounded-full border-2 p-2 border-black"
        resizeMode="cover"
      />
      <View className="pt-14 rounded-[16px] z-0 shadow-xl bg-[#FFF1E1]">
        <Text className="font-bold text-[20px] text-center">{name}</Text>
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
          className="border-[#E45834] border-2 p-2 rounded-[20px]  w-[60%] mx-auto mb-4 mt-2"
          onPress={handleAddDish}
        >
          <Text className="text-[#E45834] text-center font-bold text-lg">
            Chọn món này
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal để chọn dish size */}
      {dishSizeDetails && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-[#22222391] bg-opacity-50">
            <View className="bg-white rounded-lg p-4 w-[70%]">
              <View className="flex-row ">
                <Image
                  source={typeof image === "string" ? { uri: image } : image}
                  className="w-[400px] h-full rounded-lg mb-4"
                  resizeMode="cover"
                />
                <View className=" ml-6">
                  <Text className="font-bold text-2xl mb-2 text-gray-700">
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
                  <Text className="mb-4 text-lg">{description}</Text>
                  <Text className="font-semibold">Các lựa chọn kích cỡ:</Text>
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
    </View>
  );
};

export default DishCard;
