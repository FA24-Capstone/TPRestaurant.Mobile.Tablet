import { formatPriceVND } from "@/components/Format/formatPrice";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment-timezone";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";

interface ComboCardHistoryProps {
  combo: any; // Adjust with the actual type of the combo
  itemWidth: number; // Add itemWidth prop
  comboDetails: any;
  showModal: (content: any) => void; // Function to show modal
}

const ComboCardHistory: React.FC<ComboCardHistoryProps> = ({
  combo,
  itemWidth,
  comboDetails,
  showModal,
}) => {
  return (
    <View
      className="flex-1 p-2 m-2  bg-white rounded-md shadow-lg relative"
      style={{ width: itemWidth - 20, marginHorizontal: 0 }}
    >
      <Image
        source={{ uri: combo.combo.image }}
        className="w-full h-40 rounded-md"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className="mt-2 text-lg font-bold">{combo.combo.name}</Text>
        <Text className="text-gray-500">{combo.combo.description}</Text>
        <View className="flex-row justify-between my-2">
          <Text className=" text-center text-base font-semibold text-[#C01D2E]">
            {formatPriceVND(combo.combo.price)}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-[#EDAA16] font-semibold mr-4 text-base">
              + {combo.quantity} món
            </Text>
          </View>
        </View>
        <View className="mt-2 flex-row">
          <Text className="text-gray-700 font-semibold">Thời gian đặt:</Text>
          <View className="ml-4">
            {combo.timeArray.map((time, index) => (
              <Text key={index} className="text-gray-500">
                • {time}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {comboDetails?.length > 0 && (
        <View className="p-2 ">
          <Text className="font-bold mb-2 text-gray-600">
            Lựa chọn món trong combo:
          </Text>
          <View className="flex-row ">
            {comboDetails.map((detail) => (
              <View key={detail.comboOrderDetailId} className=" mt-1 mr-2">
                <Image
                  source={{ uri: detail.dishCombo.dishSizeDetail.dish.image }}
                  className="w-12 h-12 rounded-md"
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        </View>
      )}
      <TouchableOpacity
        className="absolute top-3 right-3 rounded-full p-1"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
        onPress={() =>
          showModal(
            <View className="flex-row bg-white w-full rounded-lg">
              <Image
                source={{ uri: combo.combo.image }}
                style={{ height: 400, width: 400, resizeMode: "cover" }}
                className=" rounded-lg mr-6"
                resizeMode="cover"
              />
              <View className="p-2">
                <Text className="font-bold text-[22px] ">
                  {combo.combo.name}
                </Text>
                <Text className="text-gray-500 mb-2 text-base">
                  {combo.combo.description}
                </Text>
                <Text className="font-bold text-lg text-[#C01D2E] mb-4">
                  {formatPriceVND(combo.combo.price)}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-700 font-semibold  text-base">
                    Số lượng:{" "}
                  </Text>
                  <Text className="text-[#EDAA16] font-semibold mr-4 text-lg">
                    {combo.quantity} món
                  </Text>
                </View>
                <View className="flex-row  mb-4 items-center">
                  <Text className="text-gray-700 font-semibold  text-base">
                    Thời gian đặt:{" "}
                  </Text>
                  <Text className="text-[#EDAA16] font-semibold mr-4 text-lg">
                    {combo.timeArray.join("; ")}
                  </Text>
                </View>

                {comboDetails?.length > 0 && (
                  <View>
                    <Text className="font-bold mb-2 text-gray-600 text-xl">
                      Các món đã chọn trong combo:
                    </Text>
                    <View className="flex-row ">
                      {comboDetails.map((detail) => (
                        <View
                          key={detail.comboOrderDetailId}
                          className=" mt-1 mr-4"
                        >
                          <Image
                            source={{
                              uri: detail.dishCombo.dishSizeDetail.dish.image,
                            }}
                            className="w-24 h-24 rounded-md mx-auto"
                            resizeMode="cover"
                          />
                          <View className=" mt-2">
                            <Text className="text-gray-500 text-center text-base font-semibold ">
                              {detail.dishCombo.dishSizeDetail.dish.name}
                            </Text>
                            <Text className=" text-center text-base font-semibold text-[#C01D2E]">
                              {formatPriceVND(
                                detail.dishCombo.dishSizeDetail.price
                              )}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View className="flex-row justify-end mt-6 items-center">
                  <Button
                    mode="contained"
                    className=" w-fit bg-[#C01D2E] rounded-md mr-4"
                    labelStyle={{ fontWeight: "600", fontSize: 16 }}
                  >
                    Đặt lại
                  </Button>
                </View>
              </View>
            </View>
          )
        }
      >
        <MaterialCommunityIcons
          name="arrow-top-right-thin-circle-outline"
          size={30}
          color="#FD495C"
        />
      </TouchableOpacity>
    </View>
  );
};

export default ComboCardHistory;
