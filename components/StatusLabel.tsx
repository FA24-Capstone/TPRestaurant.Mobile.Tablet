// StatusLabel.tsx
import React from "react";
import { View, Text } from "react-native";

interface StatusLabelProps {
  statusId: number;
}

const StatusLabel: React.FC<StatusLabelProps> = ({ statusId }) => {
  let backgroundColor = "";
  let statusText = "";

  switch (statusId) {
    case 1:
      backgroundColor = "bg-gray-500";
      statusText = "Đã gửi đặt trước";
      break;
    case 2:
      backgroundColor = "bg-yellow-500";
      statusText = "Đã gửi yêu cầu";
      break;
    case 3:
      backgroundColor = "bg-blue-500";
      statusText = "Đang chế biến";
      break;
    case 4:
      backgroundColor = "bg-green-500";
      statusText = "Đã hoàn thành";
      break;
    case 5:
      backgroundColor = "bg-red-500";
      statusText = "Đã huỷ";
      break;
    default:
      backgroundColor = "bg-gray-400";
      statusText = "Không xác định";
  }

  return (
    <View className={`rounded-md px-2 py-1 max-h-8 ${backgroundColor}`}>
      <Text className="text-sm text-right font-bold  text-white uppercase">
        {statusText}
      </Text>
    </View>
  );
};

export default StatusLabel;
