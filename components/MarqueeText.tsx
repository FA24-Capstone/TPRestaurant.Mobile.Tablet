import React, { useRef, useEffect } from "react";
import { View, Text, Animated, Dimensions } from "react-native";

const MarqueeText = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get("window");

  useEffect(() => {
    const startAnimation = () => {
      animatedValue.setValue(width);

      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: -width * 1.5, // Move by 1.5 times the width to introduce a gap
          duration: 20000,
          useNativeDriver: true,
        })
      ).start();
    };

    startAnimation();
  }, [animatedValue, width]);

  const text =
    "Bàn số 001 đã có quý khách hàng Msr.Phương đặt bàn vào lúc 13:00 PM, hôm nay (20/06/2024). Chúc quý khách dùng bữa tại nhà hàng Thiên Phú ngon miệng! ";

  return (
    <View
      style={{ overflow: "hidden", width: width + 100 }}
      className="bg-[#FFD77E] p-2"
    >
      <Animated.Text
        style={{
          transform: [{ translateX: animatedValue }],
        }}
        className={"text-lg text-[#C01D2E] font-semibold"}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

export default MarqueeText;
