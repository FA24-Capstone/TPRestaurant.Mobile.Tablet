import FeedbackPanel from "@/components/Feedback/FeedbackPanel";
import MarqueeText from "@/components/MarqueeText";
import React from "react";
import { View, Text } from "react-native";

const Feedback = () => {
  return (
    <View className="flex-1">
      <MarqueeText />
      <FeedbackPanel />
    </View>
  );
};

export default Feedback;
