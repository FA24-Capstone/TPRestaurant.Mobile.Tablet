import React, { useEffect, useRef, useState, useMemo } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment-timezone";
import { fetchReservationWithTime } from "@/api/reservationApi";
import { RootState, AppDispatch } from "@/redux/store";

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

  const { width } = Dimensions.get("window");
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(10);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Biến để kiểm tra xem dữ liệu đã được tải hay chưa
  const hasFetched = useRef(false);

  useEffect(() => {
    // Chỉ fetch dữ liệu nếu chưa fetch trước đó và chưa có dữ liệu
    if (!hasFetched.current && !reservationData) {
      const fetchReservation = async () => {
        if (tableId) {
          const now = moment()
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
          await dispatch(
            fetchReservationWithTime({
              tableId,
              time: "2024-09-28 23:10:44.3000000",
            })
          );
          // Sau khi fetch xong, đánh dấu đã fetch
          hasFetched.current = true;
        }
      };

      fetchReservation();
    }
  }, [dispatch, tableId, reservationData]);

  const reservationText = useMemo(() => {
    if (reservationData && reservationData.result) {
      const reservation = reservationData.result.order;
      const customerName = reservation?.account?.lastName
        ? `${reservation.account.firstName} ${reservation.account.lastName}`
        : "ẩn danh";
      const reservationTime = moment(reservation.mealTime).format(
        "HH:mm A, DD/MM/YYYY"
      );

      return `Bàn số ${tableName} đã có quý khách ${customerName} đặt bàn vào lúc ${reservationTime}. Chúc quý khách dùng bữa tại nhà hàng Thiên Phú ngon miệng!`;
    }
    return "";
  }, [reservationData, tableName]);

  useEffect(() => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }

    scrollInterval.current = setInterval(() => {
      setScrollPosition((prevPosition) => {
        const newPosition = prevPosition + 2;

        // Khi cuộn hết văn bản, đặt lại vị trí cuộn
        if (newPosition > width + 2000) {
          return 0; // Đặt lại về vị trí bắt đầu
        }

        return newPosition;
      });
    }, 1); // tốc độ cuộn, có thể thay đổi giá trị này để tăng/giảm tốc độ

    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [width]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: scrollPosition + 3,
        animated: false,
      });
    }
  }, [scrollPosition]);

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
    <View style={{ overflow: "hidden", width: width }}>
      {reservationText && (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={{ flexDirection: "row" }}
        >
          <Text
            style={{ width: width + 2500 }}
            className={
              "text-center bg-[#FFD77E] py-1 text-lg text-[#C01D2E] font-medium"
            }
          >
            {reservationText}
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

export default MarqueeText;
