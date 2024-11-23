import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Button, Portal, Modal } from "react-native-paper";
import PromotionModal from "./Modals/PromotionModal";
import {
  getAvailableCouponPrograms,
  getAvailableCouponsByAccountId,
} from "@/api/couponApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ItemCouponPrograms } from "@/app/types/coupon_all_type";

// interface ItemCouponPrograms {
//   couponId: string;
//   couponProgram: {
//     title: string;
//     expiryDate: string;
//     discountPercent: number;
//     img: string;
//     minimumAmount: number;
//   };
//   isUsedOrExpired: boolean;
// }

const PromotionList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [coupons, setCoupons] = useState<ItemCouponPrograms[]>([]); // State cho danh sách coupon
  const [selectedCoupon, setSelectedCoupon] =
    useState<ItemCouponPrograms | null>(null);

  // Gọi API khi component mount
  useEffect(() => {
    const fetchCoupons = async () => {
      const pageNumber = 1;
      const pageSize = 10;
      try {
        const response = await getAvailableCouponPrograms(pageNumber, pageSize);
        if (response.isSuccess) {
          setCoupons(response.result.items);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const showModal = (coupon: ItemCouponPrograms) => {
    setSelectedCoupon(coupon);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedCoupon(null);
  };

  return (
    <>
      <ScrollView horizontal className="">
        {coupons.map((coupon) => (
          <TouchableOpacity
            onPress={() => showModal(coupon)}
            key={coupon.couponProgramId}
            className=" my-4  w-[250px] ml-4 rounded-lg shadow-lg"
          >
            <ImageBackground
              source={require("../assets/Icons/bg-coupon.jpg")} // Thay 'your-image.png' bằng đường dẫn đúng
              style={{
                borderRadius: 16,
                overflow: "hidden", // Đảm bảo các góc bo tròn cho hình nền
                borderColor: "#f0f0f0",
                paddingHorizontal: 10,
                paddingVertical: 35,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "900",
                  fontSize: 14,
                  textTransform: "uppercase",
                  color: "#970C1A",
                }}
              >
                Mã giảm {coupon.couponProgramType.vietnameseName}
              </Text>
              <Image
                source={{ uri: coupon.img }}
                style={{
                  width: 50,
                  height: 50,
                  alignSelf: "center",
                  marginVertical: 6,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: "#970C1A",
                  fontSize: 24,
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                GIẢM {coupon.discountPercent}%
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "#555",
                  fontWeight: "600",
                  marginVertical: 8,
                }}
              >
                Cho đơn hàng từ{" "}
                {coupon.minimumAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                })}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: "#888",
                  fontWeight: "500",
                  marginBottom: 16,
                }}
              >
                {coupon.title}
              </Text>
              <Button
                mode="contained"
                onPress={() => showModal(coupon)}
                style={{
                  backgroundColor: "#970C1A",
                  // paddingVertical: 2,
                  width: "80%",
                  marginHorizontal: "auto",
                  marginTop: 35,
                }}
                className="mx-auto"
                labelStyle={{
                  fontWeight: "600",
                  fontSize: 14,
                  textTransform: "uppercase",
                }}
              >
                Xem thêm
              </Button>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedCoupon && (
        <PromotionModal
          visible={visible}
          promotion={selectedCoupon}
          onDismiss={hideModal}
          setVisible={setVisible}
        />
      )}
    </>
  );
};

export default PromotionList;
