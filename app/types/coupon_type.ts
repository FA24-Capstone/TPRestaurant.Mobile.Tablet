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

// ==================== Get Available Coupons by Id Account ====================

export interface ResultCouponsByAccountId {
  items: Coupon[];
  totalPages: number;
}

export interface Coupon {
  couponId: string;
  isUsedOrExpired: boolean;
  orderId: any;
  order: any;
  accountId: string;
  account: Account;
  couponProgramId: string;
  couponProgram: CouponProgram;
}

export interface Account {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  gender: boolean;
  address: string;
  isVerified: boolean;
  isDeleted: boolean;
  loyaltyPoint: number;
  avatar: string;
  isManuallyCreated: boolean;
  isDelivering: boolean;
  storeCreditAmount: number;
  expiredDate: string;
  registeredDate: string;
  isBanned: boolean;
  userRankId: number;
  userRank: any;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface CouponProgram {
  couponProgramId: string;
  title: string;
  code: string;
  discountPercent: number;
  startDate: string;
  expiryDate: string;
  isDeleted: boolean;
  minimumAmount: number;
  quantity: number;
  img: string;
  userRankId: number;
  userRank: UserRank;
  couponProgramTypeId: number;
  couponProgramType: CouponProgramType;
  createDate: string;
  updateDate: string;
  createBy: string;
  createByAccount: any;
  updateBy: any;
  updateByAccount: any;
}

export interface UserRank {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface CouponProgramType {
  id: number;
  name: string;
  vietnameseName: string;
}
