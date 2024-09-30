import React, { useRef, useState, useEffect } from "react";
import { View, Image, Dimensions, FlatList, StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";

const { width: viewportWidth } = Dimensions.get("window");

interface DataItem {
  id: string;
  image: any;
}

const data: DataItem[] = [
  { id: "1", image: require("../assets/banner/Banner1.jpg") },
  { id: "2", image: require("../assets/banner/banner2.jpg") },
  { id: "3", image: require("../assets/banner/banner3.jpg") },
];

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
    width: "100%", // Hoặc một giá trị cụ thể như 500 nếu cần
  },
  imageContainer: {
    width: 635, // Hoặc một giá trị cụ thể để kiểm soát kích thước
    overflow: "hidden",
    borderRadius: 10,
  },
});

const SliderBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<DataItem> | null>(null); // Specify type for ref

  useEffect(() => {
    const autoplayInterval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % data.length);
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: (activeIndex + 1) % data.length,
          animated: true, // Thêm animated để làm cho quá trình cuộn mượt mà hơn
        });
      }
    }, 3000);

    return () => clearInterval(autoplayInterval);
  }, [activeIndex]);

  const renderItem = ({ item }: { item: DataItem }) => (
    <Surface style={{ elevation: 4, borderRadius: 10, marginHorizontal: 10 }}>
      <View style={{ overflow: "hidden", borderRadius: 10 }}>
        <Image
          source={item.image}
          style={{ width: 615, height: 300 }}
          resizeMode="cover"
        />
      </View>
    </Surface>
  );

  return (
    <View style={styles.container} className="overflow-hidden">
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ height: 300, padding: 10 }} // Đặt chiều cao cho FlatList
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(
            event.nativeEvent.contentOffset.x / viewportWidth
          );
          setActiveIndex(index);
        }}
      />
      {/* <Text>hi</Text> */}
    </View>
  );
};

export default SliderBanner;
