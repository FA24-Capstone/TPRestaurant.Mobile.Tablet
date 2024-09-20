import { RootState } from "@/redux/store";
import React, { useRef, useEffect, useState } from "react";
import { View, Text, Animated, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { fetchReservationWithTime } from "@/api/reservationApi";

const MarqueeText = () => {
  const { deviceId, deviceCode, tableId, tableName } = useSelector(
    (state: RootState) => state.auth
  );

  const [reservationText, setReservationText] = useState<string>("");

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

  useEffect(() => {
    const fetchReservation = async () => {
      if (tableId) {
        try {
          const now = moment()
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
          const data = await fetchReservationWithTime(
            tableId,
            "2024-09-19T23:10:44.3"
          );
          // const data = await fetchReservationWithTime(tableId, now);

          // console.log("datafetchReservationWithTime:", data);
          if (data.result !== null) {
            const reservation = data.result.order;
            console.log("reservationNe", reservation);

            const customerName = reservation?.account?.lastName
              ? reservation.account.firstName
              : " ẩn danh";

            const reservationTime = moment(data.result.order.mealTime).format(
              "HH:mm A, DD/MM/YYYY"
            );

            console.log("reservationTimeNe:", reservationTime);

            setReservationText(
              `Bàn số ${tableName} đã có quý khách ${customerName} đặt bàn vào lúc ${reservationTime}. Chúc quý khách dùng bữa tại nhà hàng Thiên Phú ngon miệng!`
            );
          }
        } catch (error) {
          console.error("Failed to fetch reservation:", error);
        }
      }
    };

    fetchReservation();
  }, [tableId, tableName]);

  // const text = `Bàn số ${tableName} đã có quý khách hàng Msr.Phương đặt bàn vào lúc 13:00 PM, hôm nay (20/06/2024). Chúc quý khách dùng bữa tại nhà hàng Thiên Phú ngon miệng! `;

  return (
    <View>
      {reservationText && (
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
            {reservationText}
          </Animated.Text>
        </View>
      )}
    </View>
  );
};

export default MarqueeText;
