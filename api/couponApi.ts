import { AppActionResult } from "@/app/types/app_action_result_type";
import axios from "axios";
import apiClient from "./config";
import { CouponsData } from "@/app/types/coupon_type";

// ==================== Get Available Coupons ====================

export const getAvailableCoupons = async (
  pageNumber: number,
  pageSize: number
): Promise<AppActionResult<CouponsData>> => {
  const response = await apiClient.get<AppActionResult<CouponsData>>(
    `/coupon/get-available-coupon/${pageNumber}/${pageSize}`
  );

  return response.data;
};
