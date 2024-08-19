import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface Rating {
  id: number;
  label: string;
  image: ImageSourcePropType;
}

const FeedbackPanel: React.FC = () => {
  const [note, setNote] = useState<string>("");
  const [rating, setRating] = useState<number>(0);

  const handleFeedback = () => {
    const feedbackData = {
      review: note,
      rating,
    };
    console.log("Feedback submitted:", feedbackData);
  };

  const ratings: Rating[] = [
    {
      id: 1,
      label: "Rất tệ",
      image: require("../../assets/Icons/very_bad.png"),
    },
    { id: 2, label: "Tệ", image: require("../../assets/Icons/poor.png") },
    {
      id: 3,
      label: "Cũng được",
      image: require("../../assets/Icons/medium.png"),
    },
    { id: 4, label: "Tốt", image: require("../../assets/Icons/good.png") },
    {
      id: 5,
      label: "Rất tốt",
      image: require("../../assets/Icons/excellent.png"),
    },
  ];

  const selectRating = (id: number) => {
    setRating(id);
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEnabled={false}
    >
      <View className="flex-1 bg-[#F9F9F9]">
        <View className="flex-row items-center justify-center mx-2 ">
          <Text className="text-2xl mt-10 mb-10  font-bold text-[#970C1A] pb-4 border-b-2 border-[#970C1A] text-center uppercase">
            Đánh giá chất lượng món ăn và phục vụ
          </Text>
        </View>
        <View className="flex-row justify-between w-[70%] mx-auto mb-10">
          {ratings.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => selectRating(item.id)}
            >
              <View
                className={`p-2 ${
                  rating === item.id
                    ? "bg-[#FFF0CD] border-2 border-[#EDAA16] rounded-lg"
                    : ""
                }`}
              >
                <Image
                  source={item.image}
                  style={{ width: 150, height: 150, marginBottom: 20 }}
                />
                <Text className="text-xl font-bold text-center text-[#C01D2E]">
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View className="w-[800px] mx-auto mb-8">
          <Text className="font-semibold m-2 text-gray-700 text-lg">
            Ghi đánh giá:
          </Text>
          <TextInput
            placeholder="Nhập nội dung đánh giá (tối đa 70 ký tự)"
            value={note}
            onChangeText={setNote}
            maxLength={70}
            className="border border-gray-300 p-2 h-16 w-full rounded-xl m-2"
          />
        </View>

        <TouchableOpacity
          onPress={handleFeedback}
          className="bg-[#C01D2E] p-3 w-[40%] mx-auto rounded-md"
        >
          <Text className="text-white text-center text-lg font-bold uppercase">
            Gửi đánh giá
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default FeedbackPanel;
