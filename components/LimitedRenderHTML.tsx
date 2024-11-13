import React from "react";
import { View, StyleSheet } from "react-native";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";

interface LimitedRenderHTMLProps {
  htmlContent: string;
}

const LimitedRenderHTML: React.FC<LimitedRenderHTMLProps> = ({
  htmlContent,
}) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.truncatedView}>
      <RenderHTML
        contentWidth={width}
        source={{ html: htmlContent }}
        tagsStyles={{
          p: { fontSize: 18, color: "gray" },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  truncatedView: {
    maxHeight: 100, // Limit height to simulate truncation
    overflow: "hidden",
  },
});

export default LimitedRenderHTML;

// Usage in your component
