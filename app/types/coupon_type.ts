export interface CouponsData {
  items: ItemCoupons[];
  totalPages: number;
}

export interface ItemCoupons {
  couponProgramId: string;
  code: string;
  discountPercent: number;
  startDate: string;
  expiryDate: string;
  minimumAmount: number;
  quantity: number;
  img: string;
  accountId: string;
  account: any;
}
