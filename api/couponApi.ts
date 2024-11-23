import { AppActionResult } from "@/app/types/app_action_result_type";
import axios from "axios";
import apiClient from "./config";
import { CouponsData, ResultCouponsByAccountId } from "@/app/types/coupon_type";
import { CouponPrograms } from "@/app/types/coupon_all_type";

// ==================== Get Available Coupon Programs ====================

export const getAvailableCouponPrograms = async (
  pageNumber: number,
  pageSize: number
): Promise<AppActionResult<CouponPrograms>> => {
  // Xây dựng URL dựa trên endpoint được yêu cầu
  const url = `/coupon/get-available-coupon-program/${pageNumber}/${pageSize}`;

  // Gọi API
  try {
    const response = await apiClient.get<AppActionResult<CouponPrograms>>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching available coupon programs:", error);
    throw error; // Ném lỗi để xử lý trong phần logic gọi API
  }
};

// ==================== Get Available Coupons By Account ID ====================

export const getAvailableCouponsByAccountId = async (
  accountId: string,
  pageNumber: number,
  pageSize: number,
  total?: number // Tham số tùy chọn
): Promise<AppActionResult<ResultCouponsByAccountId>> => {
  // Tạo URL động dựa trên việc có `total` hay không
  const url = total
    ? `/coupon/get-available-coupon-by-account-id/${accountId}/${pageNumber}/${pageSize}?total=${total}`
    : `/coupon/get-available-coupon-by-account-id/${accountId}/${pageNumber}/${pageSize}`;

  // Gọi API
  const response = await apiClient.get<
    AppActionResult<ResultCouponsByAccountId>
  >(url);

  return response.data;
};
