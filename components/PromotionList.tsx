import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Card, Button, Portal, Modal, Provider } from "react-native-paper";
import { ImageSourcePropType } from "react-native";
import PromotionModal from "./Modals/PromotionModal";

interface Promotion {
  id: number;
  image: ImageSourcePropType;
  title: string;
  expiryDate: string;
  description: string;
}

const promotions: Promotion[] = [
  {
    id: 1,
    image: require("../assets/banner/Banner1.jpg"),
    title: "Khuyến mãi 1",
    expiryDate: "01/01/2025",
    description: "Chi tiết khuyến mãi 1",
  },
  {
    id: 2,
    image: require("../assets/banner/Banner1.jpg"),
    title: "Khuyến mãi 2",
    expiryDate: "01/02/2025",
    description: "Chi tiết khuyến mãi 1",
  },
  {
    id: 3,
    image: require("../assets/banner/Banner1.jpg"),
    title: "Khuyến mãi 2",
    expiryDate: "01/02/2025",
    description: "Chi tiết khuyến mãi 1",
  },
  {
    id: 4,
    image: require("../assets/banner/Banner1.jpg"),
    title: "Khuyến mãi 2",
    expiryDate: "01/02/2025",
    description: "Chi tiết khuyến mãi 1",
  },
  {
    id: 5,
    image: require("../assets/banner/Banner1.jpg"),
    title: "Khuyến mãi 2",
    expiryDate: "01/02/2025",
    description: "Chi tiết khuyến mãi 1",
  },
  {
    id: 6,
    image: require("../assets/banner/Banner1.jpg"),
    title: "Khuyến mãi 2",
    expiryDate: "01/02/2025",
    description: "Chi tiết khuyến mãi 1",
  },
  {
    id: 7,
    image: require("../assets/banner/Banner1.jpg"),
    title: "Khuyến mãi 2",
    expiryDate: "01/02/2025",
    description: "Chi tiết khuyến mãi 1",
  },
];

const PromotionList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );

  const showModal = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedPromotion(null);
  };
  return (
    <>
      <ScrollView horizontal className="mt-2">
        {promotions.map((promotion) => (
          <Card
            key={promotion.id}
            className="m-2 w-[250px] shadow-lg bg-[#FFFFFF]"
            onPress={() => showModal(promotion)}
          >
            <Card.Cover source={promotion.image} className="h-[150px]" />
            <Card.Content>
              <Text className="font-medium text-lg mt-2">
                {promotion.title}
              </Text>
              <Text className="text-gray-500">
                Hết hạn: {promotion.expiryDate}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                className="mt-2 bg-[#970C1A]"
                labelStyle={{ fontWeight: "600", fontSize: 16 }} // Semibold
              >
                Dùng ngay
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <PromotionModal
        visible={visible}
        promotion={selectedPromotion}
        onDismiss={hideModal}
      />
    </>
  );
};

export default PromotionList;
