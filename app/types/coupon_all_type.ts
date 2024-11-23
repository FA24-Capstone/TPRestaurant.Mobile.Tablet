export interface CouponPrograms {
  items: ItemCouponPrograms[];
  totalPages: number;
}

export interface ItemCouponPrograms {
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
  userRankId?: number;
  userRank?: UserRank;
  couponProgramTypeId: number;
  couponProgramType: CouponProgramType;
  createDate: string;
  updateDate: string;
  createBy: string;
  createByAccount: CreateByAccount;
  updateBy?: string;
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

export interface CreateByAccount {
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
  passwordHash: any;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}
