import { RootState, AppDispatch } from "@/redux/store";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { View, Text, Animated, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment-timezone";
import { fetchReservationWithTime } from "@/api/reservationApi";

const MarqueeText = () => {
  const dispatch: AppDispatch = useDispatch();

  const { tableId, tableName } = useSelector((state: RootState) => state.auth);

  const reservationData = useSelector(
    (state: RootState) => state.reservation.data
  );
  const isLoading = useSelector(
    (state: RootState) => state.reservation.isLoading
  );
  const error = useSelector((state: RootState) => state.reservation.error);

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

  ("2024-09-28 23:10:44.3000000");

  useEffect(() => {
    const fetchReservation = async () => {
      if (tableId) {
        const now = moment()
          .tz("Asia/Ho_Chi_Minh")
          .format("YYYY-MM-DD HH:mm:ss.SSSSSSS");

        // Dispatch async thunk để fetch dữ liệu
        // dispatch(fetchReservationWithTime({ tableId, time: now }));
        dispatch(
          fetchReservationWithTime({
            tableId,
            time: "2024-09-28 23:10:44.3000000",
          })
        );
      }
    };

    fetchReservation();
  }, [dispatch, tableId]);

  // const text = `Bàn số ${tableName} đã có quý khách hàng Msr.Phương đặt bàn vào lúc 13:00 PM, hôm nay (20/06/2024). Chúc quý khách dùng bữa tại nhà hàng Thiên Phú ngon miệng! `;

  // Tính toán reservationText dựa trên dữ liệu từ Redux store
  const reservationText = useMemo(() => {
    if (reservationData && reservationData.result) {
      const reservation = reservationData.result.order;
      // console.log("reservationNe", reservation);

      const customerName = reservation?.account?.lastName
        ? `${reservation.account.firstName} ${reservation.account.lastName}`
        : "ẩn danh";

      const reservationTime = moment(reservation.mealTime).format(
        "HH:mm A, DD/MM/YYYY"
      );

      // console.log("reservationTimeNe:", reservationTime);

      return `Bàn số ${tableName} đã có quý khách ${customerName} đặt bàn vào lúc ${reservationTime}. Chúc quý khách dùng bữa tại nhà hàng Thiên Phú ngon miệng!`;
    }
    return "";
  }, [reservationData, tableName]);

  // console.log("reservationTextNe:", reservationText);

  // Xử lý trạng thái Loading và Error (tùy chọn)
  if (isLoading) {
    return (
      <View
        style={{ overflow: "hidden", width: width + 100 }}
        className="bg-[#FFD77E] p-2"
      >
        <Text className={"text-lg text-[#C01D2E] font-semibold"}>
          Loading...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{ overflow: "hidden", width: width + 100 }}
        className="bg-[#FFD77E] p-2"
      >
        <Text className={"text-lg text-[#C01D2E] font-semibold"}>
          Error: {error}
        </Text>
      </View>
    );
  }

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
