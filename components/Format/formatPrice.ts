// formatCurrency.ts
export const formatPriceVND = (price: number | string): string => {
  // Chuyển đổi giá trị thành số nếu nó là chuỗi
  const priceNumber = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(priceNumber)) {
    return "Invalid price";
  }

  // Định dạng giá với dấu chấm làm dấu phân cách hàng nghìn
  return priceNumber.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });
};
